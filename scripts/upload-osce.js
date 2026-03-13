import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://epbvcgfwoxdtapzrhedp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NDk3MiwiZXhwIjoyMDg4ODQwOTcyfQ.6-7_uDx3xHnHbKtfKYOzlqZu3AoXpOYWVf7ynWpnFK8'
);

const csv = readFileSync('C:/Users/Usuario/Desktop/Factos/scripts/output/proveedores_osce.csv', 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());

console.log(`Total registros OSCE: ${lines.length}`);

function parseLine(line) {
  const matches = [];
  let current = '', inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { matches.push(current); current = ''; continue; }
    current += ch;
  }
  matches.push(current);
  return { nombre: matches[0], ruc: matches[1], correo: matches[2] || '', telefono: matches[3] || '' };
}

const BATCH = 500;
let updated = 0, errors = 0;

for (let i = 0; i < lines.length; i += BATCH) {
  const batch = lines.slice(i, i + BATCH).map(parseLine).filter(r => r.ruc);
  
  const { error } = await supabase.from('proveedores').upsert(
    batch.map(r => ({
      nombre: r.nombre,
      ruc: r.ruc,
      correo: r.correo,
      telefono: r.telefono,
      fuente: 'OSCE'
    })),
    { onConflict: 'ruc' }
  );

  if (error) {
    console.error(`Error batch ${i}: ${error.message}`);
    errors++;
  }

  updated += batch.length;
  if (updated % 10000 === 0 || i + BATCH >= lines.length) {
    console.log(`Procesados: ${updated}/${lines.length} (${(updated/lines.length*100).toFixed(1)}%)`);
  }
}

console.log(`\n✅ DONE! ${updated} registros procesados, ${errors} errores`);
