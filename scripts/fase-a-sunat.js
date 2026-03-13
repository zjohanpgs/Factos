/**
 * Fase A: Extraer todas las empresas RUC 20 activas del padrón SUNAT
 * 
 * Lee padron_reducido_ruc.txt y genera CSV con:
 * Nombre | RUC | Correo (vacío) | Teléfono (vacío) | Dirección | Estado
 * 
 * Ejecutar: node scripts/fase-a-sunat.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const PADRON_FILE = path.join(__dirname, 'padron_reducido_ruc.txt');

function escapeCSV(str) {
  if (!str || str === '-') return '';
  return `"${str.replace(/"/g, '""')}"`;
}

async function main() {
  console.log('=== Fase A: Base completa SUNAT - Empresas RUC 20 ===\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const csvPath = path.join(OUTPUT_DIR, 'empresas_sunat_ruc20.csv');
  
  // Header del padrón:
  // RUC|NOMBRE|ESTADO|CONDICIÓN|UBIGEO|TIPO_VIA|NOMBRE_VIA|COD_ZONA|TIPO_ZONA|NUMERO|INTERIOR|LOTE|DEPARTAMENTO|MANZANA|KILOMETRO|
  
  const header = '"Nombre de empresa","RUC","Correo","Telefono","Direccion","Departamento","Estado","Condicion"\n';
  fs.writeFileSync(csvPath, header);
  
  const rl = readline.createInterface({
    input: fs.createReadStream(PADRON_FILE, { encoding: 'latin1' }),
    crlfDelay: Infinity,
  });
  
  let lineNum = 0;
  let count = 0;
  let activos = 0;
  let batch = [];
  const BATCH_SIZE = 5000;
  
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) continue; // skip header
    
    const p = line.split('|');
    const ruc = p[0];
    
    // Solo RUC 20 (jurídicas)
    if (!ruc.startsWith('20')) continue;
    count++;
    
    const nombre = p[1] || '';
    const estado = p[2] || '';
    const condicion = p[3] || '';
    const tipoVia = p[5] || '';
    const nombreVia = p[6] || '';
    const numero = p[9] || '';
    const departamento = p[12] || '';
    
    // Construir dirección
    let direccion = '';
    if (nombreVia && nombreVia !== '-') {
      direccion = `${tipoVia !== '-' ? tipoVia + ' ' : ''}${nombreVia}`;
      if (numero && numero !== '-') direccion += ` ${numero}`;
    }
    
    if (estado === 'ACTIVO') activos++;
    
    batch.push(
      `${escapeCSV(nombre)},${ruc},"","",${escapeCSV(direccion)},${escapeCSV(departamento !== '-' ? departamento : '')},${escapeCSV(estado)},${escapeCSV(condicion)}`
    );
    
    if (batch.length >= BATCH_SIZE) {
      fs.appendFileSync(csvPath, batch.join('\n') + '\n');
      batch = [];
      if (count % 100000 === 0) {
        console.log(`  ${count.toLocaleString()} empresas RUC 20 procesadas (${activos.toLocaleString()} activas)...`);
      }
    }
  }
  
  // Flush remaining
  if (batch.length > 0) {
    fs.appendFileSync(csvPath, batch.join('\n') + '\n');
  }
  
  console.log(`\n=== FASE A COMPLETADA ===`);
  console.log(`Total empresas RUC 20: ${count.toLocaleString()}`);
  console.log(`Empresas activas: ${activos.toLocaleString()}`);
  console.log(`Archivo: ${csvPath}`);
  
  // Tamaño del archivo
  const stats = fs.statSync(csvPath);
  console.log(`Tamaño: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
