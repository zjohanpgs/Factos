import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const SUPABASE_URL = 'https://epbvcgfwoxdtapzrhedp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NDk3MiwiZXhwIjoyMDg4ODQwOTcyfQ.6-7_uDx3xHnHbKtfKYOzlqZu3AoXpOYWVf7ynWpnFK8';

const CSV_FILE = new URL('./output/empresas_sunat_ruc20.csv', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const BATCH_SIZE = 1000;

// Solo subir empresas ACTIVAS y HABIDAS
const ESTADO_OK = 'ACTIVO';
const CONDICION_OK = 'HABIDO';

function parseCsvLine(line) {
  const vals = [];
  let cur = '', inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuote = !inQuote; continue; }
    if (c === ',' && !inQuote) { vals.push(cur); cur = ''; continue; }
    cur += c;
  }
  vals.push(cur);
  return vals;
}

async function upsertBatch(rows, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/proveedores?on_conflict=ruc`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates'
        },
        body: JSON.stringify(rows)
      });
      if (!res.ok) {
        const txt = await res.text();
        if (attempt < retries - 1) { await new Promise(r => setTimeout(r, 2000)); continue; }
        throw new Error(`Supabase ${res.status}: ${txt}`);
      }
      return;
    } catch (e) {
      if (attempt < retries - 1) { await new Promise(r => setTimeout(r, 2000)); continue; }
      throw e;
    }
  }
}

async function main() {
  console.log('Leyendo CSV SUNAT:', CSV_FILE);
  console.log('Filtrando: solo ACTIVO + HABIDO');
  
  const rl = createInterface({ input: createReadStream(CSV_FILE, 'utf-8') });
  let batch = [], total = 0, uploaded = 0, skipped = 0, isHeader = true;

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    if (!line.trim()) continue;

    const [nombre, ruc, correo, telefono, dir, depto, estado, condicion] = parseCsvLine(line);
    total++;

    // Solo empresas activas y habidas
    if (estado !== ESTADO_OK || !condicion.startsWith('HABIDO')) {
      skipped++;
      continue;
    }

    if (!ruc || ruc.length !== 11) { skipped++; continue; }

    batch.push({
      nombre: nombre || '',
      ruc,
      correo: '',
      telefono: '',
      fuente: 'SUNAT'
    });

    if (batch.length >= BATCH_SIZE) {
      await upsertBatch(batch);
      uploaded += batch.length;
      batch = [];
      if (uploaded % 50000 === 0) {
        console.log(`  Subidos: ${uploaded.toLocaleString()} | Saltados: ${skipped.toLocaleString()} | Total leidos: ${total.toLocaleString()}`);
      }
    }
  }

  if (batch.length > 0) {
    await upsertBatch(batch);
    uploaded += batch.length;
  }

  console.log(`\nCompletado:`);
  console.log(`  Total leidos: ${total.toLocaleString()}`);
  console.log(`  Subidos: ${uploaded.toLocaleString()}`);
  console.log(`  Saltados (inactivos/no habidos): ${skipped.toLocaleString()}`);
  console.log(`  OSCE duplicados ignorados (ya existen)`);
}

main().catch(e => { console.error(e); process.exit(1); });
