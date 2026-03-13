/**
 * Upload Enrichment — Sube datos enriquecidos a Supabase
 *
 * Lee el CSV generado por enrich-sunat.js y actualiza los registros
 * existentes en la tabla proveedores con los nuevos campos.
 *
 * IMPORTANTE: Antes de ejecutar, correr la migración SQL en Supabase:
 *   scripts/migrate-enrichment.sql
 *
 * Uso: node scripts/upload-enrichment.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, 'output', 'enrichment_sunat.csv');

const SUPABASE_URL = 'https://epbvcgfwoxdtapzrhedp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NDk3MiwiZXhwIjoyMDg4ODQwOTcyfQ.6-7_uDx3xHnHbKtfKYOzlqZu3AoXpOYWVf7ynWpnFK8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BATCH_SIZE = 500;

function parseLine(line) {
  const fields = [];
  let current = '', inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue; }
    current += ch;
  }
  fields.push(current);

  return {
    ruc: fields[0],
    actividad_economica: fields[1] || '',
    tipo_contribuyente: fields[2] || '',
    fecha_inscripcion: fields[3] || '',
    direccion: fields[4] || '',
    departamento: fields[5] || '',
    provincia: fields[6] || '',
    distrito: fields[7] || '',
    ubigeo: fields[8] || '',
    estado: fields[9] || '',
    condicion: fields[10] || '',
  };
}

async function main() {
  console.log('=== Upload Enrichment a Supabase ===\n');

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`No se encontró el archivo CSV: ${CSV_PATH}`);
    console.error('Primero ejecuta: node scripts/enrich-sunat.js');
    process.exit(1);
  }

  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csv.split('\n').slice(1).filter(l => l.trim()); // skip header

  console.log(`Registros a subir: ${lines.length.toLocaleString()}\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE).map(parseLine).filter(r => r.ruc);

    const { error } = await supabase.from('proveedores').upsert(
      batch.map(r => ({
        ruc: r.ruc,
        actividad_economica: r.actividad_economica,
        tipo_contribuyente: r.tipo_contribuyente,
        fecha_inscripcion: r.fecha_inscripcion,
        direccion: r.direccion,
        departamento: r.departamento,
        provincia: r.provincia,
        distrito: r.distrito,
        ubigeo: r.ubigeo,
        estado: r.estado,
        condicion: r.condicion,
      })),
      { onConflict: 'ruc', ignoreDuplicates: false }
    );

    if (error) {
      console.error(`Error en batch ${i}: ${error.message}`);
      errors++;
    }

    updated += batch.length;

    if (updated % 5000 === 0 || i + BATCH_SIZE >= lines.length) {
      console.log(`Procesados: ${updated.toLocaleString()}/${lines.length.toLocaleString()} (${(updated / lines.length * 100).toFixed(1)}%)`);
    }
  }

  console.log(`\n✅ DONE!`);
  console.log(`Registros actualizados: ${updated.toLocaleString()}`);
  console.log(`Errores: ${errors}`);
}

main().catch(console.error);
