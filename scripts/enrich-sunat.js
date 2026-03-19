/**
 * Enriquecimiento SUNAT — Fase C
 *
 * Consulta la API pública de SUNAT para obtener datos adicionales por RUC:
 * - Actividad económica (CIIU)
 * - Tipo de contribuyente (SAC, SRL, EIRL, etc.)
 * - Fecha de inscripción
 * - Dirección completa (departamento, provincia, distrito)
 * - Estado y condición
 *
 * API utilizada: apis.net.pe (la más popular en Perú para consulta SUNAT)
 *   - Sin token: ~25 consultas/día (solo para probar)
 *   - Con token gratuito: ~100 consultas/día
 *   - Plan Básico ($15/mes): 5,000/día
 *   - Plan Premium ($50/mes): 50,000/día
 *   - Registrarse en: https://apis.net.pe/
 *
 * Uso:
 *   node scripts/enrich-sunat.js                    # Sin token (prueba)
 *   SUNAT_API_TOKEN=tu_token node scripts/enrich-sunat.js   # Con token
 *
 * El script tiene capacidad de resume — si se interrumpe, retoma donde quedó.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');

// ─── Configuración ───────────────────────────────────────────
const API_TOKEN = process.env.SUNAT_API_TOKEN || '';
const API_BASE = 'https://api.decolecta.com/v1/sunat/ruc/full';
const CONCURRENCY = API_TOKEN ? 5 : 1;         // Con token: 5 paralelas, sin token: 1
const DELAY_BETWEEN_BATCHES = API_TOKEN ? 200 : 3000; // ms entre lotes
const BATCH_LOG_INTERVAL = 100;                 // Log cada N registros

const SUPABASE_URL = 'https://epbvcgfwoxdtapzrhedp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NDk3MiwiZXhwIjoyMDg4ODQwOTcyfQ.6-7_uDx3xHnHbKtfKYOzlqZu3AoXpOYWVf7ynWpnFK8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Archivos de salida ──────────────────────────────────────
const CSV_PATH = path.join(OUTPUT_DIR, 'enrichment_sunat.csv');
const PROGRESS_PATH = path.join(OUTPUT_DIR, 'progress_enrichment.json');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeCSV(str) {
  if (!str) return '';
  return `"${str.replace(/"/g, '""')}"`;
}

// ─── Consulta API ────────────────────────────────────────────
async function fetchSunatData(ruc, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers = { 'Accept': 'application/json' };
      if (API_TOKEN) {
        headers['Authorization'] = `Bearer ${API_TOKEN}`;
      }

      const res = await fetch(`${API_BASE}?numero=${ruc}`, { headers });

      // Rate limit — esperar y reintentar
      if (res.status === 429) {
        const waitSec = Math.min(60, 10 * attempt);
        console.log(`  ⏳ Rate limit alcanzado, esperando ${waitSec}s...`);
        await sleep(waitSec * 1000);
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // La API devuelve los datos directamente
      return {
        ruc: ruc,
        actividad_economica: data.actividad_economica || '',
        tipo_contribuyente: data.tipo || '',
        fecha_inscripcion: data.fecha_inscripcion || '',
        direccion: data.direccion || '',
        departamento: data.departamento || '',
        provincia: data.provincia || '',
        distrito: data.distrito || '',
        ubigeo: data.ubigeo || '',
        estado: data.estado || '',
        condicion: data.condicion || '',
      };
    } catch (err) {
      if (attempt < retries) {
        await sleep(2000 * attempt);
      } else {
        return null; // Fallo después de todos los intentos
      }
    }
  }
}

// ─── Obtener RUCs de Supabase ────────────────────────────────
async function fetchRucsFromSupabase() {
  console.log('1. Obteniendo RUCs de Supabase...');

  const allRucs = [];
  const PAGE = 10000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('proveedores')
      .select('ruc')
      .order('ruc')
      .range(offset, offset + PAGE - 1);

    if (error) throw new Error(`Supabase error: ${error.message}`);

    if (data.length > 0) {
      allRucs.push(...data.map(d => d.ruc));
      offset += PAGE;
      if (offset % 100000 === 0) {
        console.log(`   ${allRucs.length.toLocaleString()} RUCs leídos...`);
      }
    }

    hasMore = data.length === PAGE;
  }

  console.log(`   Total: ${allRucs.length.toLocaleString()} RUCs\n`);
  return allRucs;
}

// ─── Procesar en lotes ───────────────────────────────────────
async function processInBatches(rucs) {
  let processed = 0;
  let enriched = 0;
  let failed = 0;

  // Cargar progreso previo
  let startFrom = 0;
  if (fs.existsSync(PROGRESS_PATH)) {
    const prog = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'));
    startFrom = prog.processed || 0;
    enriched = prog.enriched || 0;
    failed = prog.failed || 0;
    processed = startFrom;
    console.log(`   Retomando desde ${startFrom.toLocaleString()} (${enriched.toLocaleString()} enriquecidos)\n`);
  }

  const total = rucs.length;
  const startTime = Date.now();

  for (let i = startFrom; i < total; i += CONCURRENCY) {
    const batch = rucs.slice(i, Math.min(i + CONCURRENCY, total));

    // Consultar API en paralelo
    const results = await Promise.all(
      batch.map(ruc => fetchSunatData(ruc))
    );

    // Escribir resultados al CSV
    const lines = [];
    for (const r of results) {
      if (r) {
        enriched++;
        lines.push([
          r.ruc,
          escapeCSV(r.actividad_economica),
          escapeCSV(r.tipo_contribuyente),
          escapeCSV(r.fecha_inscripcion),
          escapeCSV(r.direccion),
          escapeCSV(r.departamento),
          escapeCSV(r.provincia),
          escapeCSV(r.distrito),
          r.ubigeo,
          escapeCSV(r.estado),
          escapeCSV(r.condicion),
        ].join(','));
      } else {
        failed++;
      }
    }

    if (lines.length > 0) {
      fs.appendFileSync(CSV_PATH, lines.join('\n') + '\n');
    }

    processed += batch.length;

    // Log de progreso
    if (processed % BATCH_LOG_INTERVAL < CONCURRENCY || processed >= total) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = (processed - startFrom) / elapsed;
      const remaining = total > processed ? (total - processed) / rate : 0;

      let etaStr;
      if (remaining > 86400) etaStr = `${(remaining / 86400).toFixed(1)} días`;
      else if (remaining > 3600) etaStr = `${(remaining / 3600).toFixed(1)} horas`;
      else etaStr = `${Math.round(remaining / 60)} min`;

      console.log(
        `[${processed.toLocaleString()}/${total.toLocaleString()}] ` +
        `Enriquecidos: ${enriched.toLocaleString()} | Fallidos: ${failed.toLocaleString()} | ` +
        `${rate.toFixed(1)} RUC/s | ETA: ${etaStr}`
      );

      // Guardar progreso
      fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ processed, enriched, failed }));
    }

    // Delay entre lotes para respetar rate limits
    await sleep(DELAY_BETWEEN_BATCHES);
  }

  return { processed, enriched, failed };
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  console.log('=== Enriquecimiento SUNAT — Fase C ===\n');

  if (API_TOKEN) {
    console.log(`API Token: ✓ configurado (${CONCURRENCY} consultas paralelas)\n`);
  } else {
    console.log('⚠️  Sin API Token — modo prueba (1 consulta a la vez, muy lento)');
    console.log('   Para velocidad, configura: SUNAT_API_TOKEN=tu_token');
    console.log('   Regístrate en: https://apis.net.pe/\n');
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Obtener todos los RUCs
  const rucs = await fetchRucsFromSupabase();

  // Inicializar CSV si es nuevo
  if (!fs.existsSync(PROGRESS_PATH)) {
    const header = 'RUC,Actividad_Economica,Tipo_Contribuyente,Fecha_Inscripcion,Direccion,Departamento,Provincia,Distrito,Ubigeo,Estado,Condicion\n';
    fs.writeFileSync(CSV_PATH, header);
  }

  // Procesar
  console.log('2. Consultando API SUNAT para cada RUC...\n');
  const stats = await processInBatches(rucs);

  console.log(`\n=== FASE C COMPLETADA ===`);
  console.log(`Total procesados: ${stats.processed.toLocaleString()}`);
  console.log(`Enriquecidos: ${stats.enriched.toLocaleString()}`);
  console.log(`Fallidos: ${stats.failed.toLocaleString()}`);
  console.log(`Archivo: ${CSV_PATH}`);

  if (stats.enriched > 0) {
    const size = fs.statSync(CSV_PATH);
    console.log(`Tamaño CSV: ${(size.size / 1024 / 1024).toFixed(1)} MB`);
    console.log(`\nSiguiente paso: node scripts/upload-enrichment.js`);
  }
}

main().catch(console.error);
