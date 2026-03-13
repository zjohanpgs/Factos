/**
 * OSCE + SUNAT Scraper
 * 
 * 1. Lee RUCs 20 activos del padrón SUNAT
 * 2. Consulta ficha OSCE para email/teléfono
 * 3. Guarda en CSV: Nombre | RUC | Correo | Teléfono
 * 
 * Ejecutar: node scripts/scrape-osce.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';
const CONCURRENCY = 8;
const OUTPUT_DIR = path.join(__dirname, 'output');
const PADRON_FILE = path.join(__dirname, 'padron_reducido_ruc.txt');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchFicha(ruc, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/ficha/${ruc}?langTag=es`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const prov = data.proveedorT01;
      if (!prov) return null;
      return {
        nombre: prov.nomRzsProv || '',
        ruc: ruc,
        correo: (prov.emails?.length > 0) ? prov.emails.join('; ') : '',
        telefono: (prov.telefonos?.length > 0) ? prov.telefonos.join('; ') : '',
      };
    } catch (err) {
      if (attempt < retries) await sleep(2000 * attempt);
      else return null;
    }
  }
}

function escapeCSV(str) {
  if (!str) return '';
  return `"${str.replace(/"/g, '""')}"`;
}

async function processInBatches(rucs, batchSize, csvPath, progressPath) {
  let processed = 0;
  let withContact = 0;
  let inOSCE = 0;
  
  // Cargar progreso
  let startFrom = 0;
  if (fs.existsSync(progressPath)) {
    const prog = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    startFrom = prog.processed || 0;
    withContact = prog.withContact || 0;
    inOSCE = prog.inOSCE || 0;
    processed = startFrom;
    console.log(`Retomando desde ${startFrom} (${inOSCE} en OSCE, ${withContact} con contacto)\n`);
  }
  
  const total = rucs.length;
  const startTime = Date.now();
  
  for (let i = startFrom; i < total; i += batchSize) {
    const batch = rucs.slice(i, Math.min(i + batchSize, total));

    let results;
    let retryCount = 0;
    const maxRetries = 10;

    while (true) {
      try {
        results = await Promise.all(
          batch.map(ruc => fetchFicha(ruc))
        );
        break;
      } catch (err) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error(`Error persistente en batch ${i}, saltando: ${err.message}`);
          results = batch.map(() => null);
          break;
        }
        const waitSec = Math.min(30, 5 * retryCount);
        console.log(`Error de red en batch ${i}, reintentando en ${waitSec}s... (intento ${retryCount}/${maxRetries})`);
        await sleep(waitSec * 1000);
      }
    }

    // Guardar resultados
    const lines = [];
    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      if (r) {
        inOSCE++;
        if (r.correo || r.telefono) withContact++;
        lines.push(`${escapeCSV(r.nombre)},${r.ruc},${escapeCSV(r.correo)},${escapeCSV(r.telefono)}`);
      }
    }

    if (lines.length > 0) {
      fs.appendFileSync(csvPath, lines.join('\n') + '\n');
    }

    processed += batch.length;

    // Progreso cada 500 registros
    if (processed % 500 < batchSize) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = (processed - startFrom) / elapsed;
      const remaining = (total - processed) / rate;
      const remainMin = Math.round(remaining / 60);

      console.log(
        `[${processed.toLocaleString()}/${total.toLocaleString()}] ` +
        `En OSCE: ${inOSCE.toLocaleString()} | Con contacto: ${withContact.toLocaleString()} | ` +
        `${rate.toFixed(0)} RUC/s | ETA: ${remainMin} min`
      );

      // Guardar progreso
      fs.writeFileSync(progressPath, JSON.stringify({ processed, withContact, inOSCE }));
    }

    // Pequeño delay entre batches para no saturar
    await sleep(50);
  }
  
  return { processed, withContact, inOSCE };
}

async function main() {
  console.log('=== Scraper OSCE - Fase B: Proveedores con contacto ===\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // 1. Leer RUCs del padrón SUNAT
  console.log('1. Leyendo padrón SUNAT...');
  const rucs = [];
  
  const rl = readline.createInterface({
    input: fs.createReadStream(PADRON_FILE, { encoding: 'latin1' }),
    crlfDelay: Infinity,
  });
  
  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) continue; // header
    
    const parts = line.split('|');
    const ruc = parts[0];
    const estado = parts[2];
    
    // Solo RUC 20 (jurídicas) y activas
    if (ruc.startsWith('20') && estado === 'ACTIVO') {
      rucs.push(ruc);
    }
  }
  
  console.log(`   ${rucs.length.toLocaleString()} empresas activas con RUC 20\n`);
  
  // 2. Consultar OSCE para cada una
  console.log('2. Consultando fichas OSCE...');
  const csvPath = path.join(OUTPUT_DIR, 'proveedores_osce.csv');
  const progressPath = path.join(OUTPUT_DIR, 'progress_osce.json');
  
  // Inicializar CSV si no existe
  if (!fs.existsSync(progressPath)) {
    fs.writeFileSync(csvPath, '"Nombre de empresa","RUC","Correo","Telefono"\n');
  }
  
  const stats = await processInBatches(rucs, CONCURRENCY, csvPath, progressPath);
  
  console.log(`\n=== FASE B COMPLETADA ===`);
  console.log(`Total RUCs consultados: ${stats.processed.toLocaleString()}`);
  console.log(`Encontrados en OSCE: ${stats.inOSCE.toLocaleString()}`);
  console.log(`Con email y/o teléfono: ${stats.withContact.toLocaleString()}`);
  console.log(`Archivo: ${csvPath}`);
}

main().catch(console.error);
