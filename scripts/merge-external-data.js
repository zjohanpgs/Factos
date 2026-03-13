import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymvwkvnshsfzmtcyjhcl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdndrdm5zaHNmem10Y3lqaGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyNDIxNSwiZXhwIjoyMDg5MDAwMjE1fQ.GgmPWUsR666Gm2zrthpWG4b6ey0WkEIoVchTq7QXGBo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CSV_PATH = 'C:/Users/Usuario/Downloads/Data Consolidar.csv';

async function parseCSV() {
  console.log('Parsing CSV...');
  const companies = new Map(); // RUC -> consolidated data

  const rl = createInterface({
    input: createReadStream(CSV_PATH, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) continue; // skip header

    const parts = line.split(';');
    if (parts.length < 9) continue;

    const [empresa, ruc, emailFunc, tel1, tel2, tel3, cel1, cel2, emailCorp] = parts.map(s => s.trim());

    if (!ruc || ruc.length !== 11) continue;

    if (!companies.has(ruc)) {
      companies.set(ruc, {
        nombre: empresa,
        ruc,
        emails: new Set(),
        telefonos: new Set(),
      });
    }

    const c = companies.get(ruc);

    // Collect all emails
    for (const email of [emailFunc, emailCorp]) {
      if (email && email.includes('@')) {
        c.emails.add(email.toLowerCase().trim());
      }
    }

    // Collect all phones (clean up parentheses)
    for (const tel of [tel1, tel2, tel3, cel1, cel2]) {
      if (tel) {
        const cleaned = tel.replace(/[() -]/g, '').trim();
        if (cleaned.length >= 6) {
          c.telefonos.add(cleaned);
        }
      }
    }
  }

  console.log(`Parsed ${lineNum - 1} rows -> ${companies.size} unique RUCs`);
  return companies;
}

async function merge(companies) {
  // Convert to array of records matching Supabase schema
  const records = [];
  for (const [ruc, data] of companies) {
    const correo = [...data.emails].join(', ');
    const telefono = [...data.telefonos].join(', ');

    records.push({
      nombre: data.nombre,
      ruc: data.ruc,
      correo,
      telefono,
      fuente: 'EXTERNO',
    });
  }

  console.log(`\nReady to upsert ${records.length} records`);
  console.log(`  With email: ${records.filter(r => r.correo).length}`);
  console.log(`  With phone: ${records.filter(r => r.telefono).length}`);

  // First, check how many of these RUCs already exist in Supabase
  // We'll do the upsert in batches, but we need a strategy:
  // - If RUC exists WITH contact -> only update if external has MORE data
  // - If RUC exists WITHOUT contact -> update with external data
  // - If RUC doesn't exist -> insert new

  // Since we want to preserve OSCE data when it exists, we'll fetch existing
  // records for these RUCs and merge intelligently

  const BATCH = 500;
  let updated = 0;
  let inserted = 0;
  let skipped = 0;
  const startTime = Date.now();

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const rucs = batch.map(r => r.ruc);

    // Fetch existing records for these RUCs
    const { data: existing } = await supabase
      .from('proveedores')
      .select('ruc, nombre, correo, telefono, fuente')
      .in('ruc', rucs);

    const existingMap = new Map();
    if (existing) {
      for (const row of existing) {
        existingMap.set(row.ruc, row);
      }
    }

    const toUpsert = [];

    for (const rec of batch) {
      const ex = existingMap.get(rec.ruc);

      if (!ex) {
        // New company - insert as-is
        toUpsert.push(rec);
        inserted++;
      } else {
        // Existing company - merge contact data
        let newCorreo = ex.correo || '';
        let newTelefono = ex.telefono || '';
        let changed = false;

        // If existing has no email but external does, use external
        if (!newCorreo && rec.correo) {
          newCorreo = rec.correo;
          changed = true;
        } else if (newCorreo && rec.correo) {
          // Merge emails (add new ones that don't exist)
          const existingEmails = new Set(newCorreo.toLowerCase().split(/[,;]\s*/).map(e => e.trim()));
          const newEmails = rec.correo.split(/[,;]\s*/).map(e => e.trim());
          const additions = newEmails.filter(e => !existingEmails.has(e.toLowerCase()));
          if (additions.length > 0) {
            newCorreo = [newCorreo, ...additions].join(', ');
            changed = true;
          }
        }

        // Same for phone
        if (!newTelefono && rec.telefono) {
          newTelefono = rec.telefono;
          changed = true;
        } else if (newTelefono && rec.telefono) {
          const existingPhones = new Set(newTelefono.replace(/[() -]/g, '').split(/[,;]\s*/).map(t => t.trim()));
          const newPhones = rec.telefono.split(/[,;]\s*/).map(t => t.trim());
          const additions = newPhones.filter(t => !existingPhones.has(t));
          if (additions.length > 0) {
            newTelefono = [newTelefono, ...additions].join(', ');
            changed = true;
          }
        }

        if (changed) {
          // Keep original fuente if OSCE, mark as OSCE+EXTERNO if merged
          const fuente = ex.fuente === 'OSCE' ? 'OSCE+EXTERNO' : (ex.fuente || 'EXTERNO');
          toUpsert.push({
            nombre: ex.nombre || rec.nombre,
            ruc: rec.ruc,
            correo: newCorreo,
            telefono: newTelefono,
            fuente,
          });
          updated++;
        } else {
          skipped++;
        }
      }
    }

    // Upsert the batch
    if (toUpsert.length > 0) {
      // Ensure nombre is always present (required NOT NULL)
      const cleanBatch = toUpsert.map(r => {
        const ex = existingMap.get(r.ruc);
        return {
          nombre: r.nombre || (ex ? ex.nombre : '') || batch.find(b => b.ruc === r.ruc)?.nombre || '',
          ruc: r.ruc,
          correo: r.correo,
          telefono: r.telefono,
          fuente: r.fuente,
        };
      });

      const { error } = await supabase
        .from('proveedores')
        .upsert(cleanBatch, { onConflict: 'ruc' });

      if (error) {
        console.error(`Upsert error at batch ${i}:`, error.message);
      }
    }

    if ((i + BATCH) % 5000 < BATCH) {
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(`  ${Math.min(i + BATCH, records.length).toLocaleString()} / ${records.length.toLocaleString()} — inserted: ${inserted}, updated: ${updated}, skipped: ${skipped} (${elapsed.toFixed(0)}s)`);
    }
  }

  console.log(`\nDone!`);
  console.log(`  Inserted (new): ${inserted.toLocaleString()}`);
  console.log(`  Updated (merged): ${updated.toLocaleString()}`);
  console.log(`  Skipped (no new data): ${skipped.toLocaleString()}`);

  // Final count
  const { count } = await supabase.from('proveedores').select('*', { count: 'exact', head: true });
  console.log(`\nTotal rows in Supabase: ${count?.toLocaleString()}`);
}

const companies = await parseCSV();
await merge(companies);
