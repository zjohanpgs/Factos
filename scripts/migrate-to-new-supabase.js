import { createClient } from '@supabase/supabase-js';

// Old project (Merca)
const OLD_URL = 'https://epbvcgfwoxdtapzrhedp.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NDk3MiwiZXhwIjoyMDg4ODQwOTcyfQ.6-7_uDx3xHnHbKtfKYOzlqZu3AoXpOYWVf7ynWpnFK8';

// New project (Factos)
const NEW_URL = 'https://ymvwkvnshsfzmtcyjhcl.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdndrdm5zaHNmem10Y3lqaGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyNDIxNSwiZXhwIjoyMDg5MDAwMjE1fQ.GgmPWUsR666Gm2zrthpWG4b6ey0WkEIoVchTq7QXGBo';

const oldDb = createClient(OLD_URL, OLD_KEY);
const newDb = createClient(NEW_URL, NEW_KEY);

const BATCH_SIZE = 1000; // Supabase default max per request

async function migrate() {
  // Get total count from old DB
  const { count: totalCount } = await oldDb
    .from('proveedores')
    .select('*', { count: 'exact', head: true });

  console.log(`Total rows in old DB: ${totalCount}`);

  // Get the last id migrated in new DB to resume
  const { data: lastRow } = await newDb
    .from('proveedores')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  // Count existing rows
  const { count: existingCount } = await newDb
    .from('proveedores')
    .select('*', { count: 'exact', head: true });

  console.log(`Existing rows in new DB: ${existingCount || 0}`);

  if (existingCount >= totalCount) {
    console.log('Migration already complete!');
    return;
  }

  // Use cursor-based pagination with id > lastId
  let lastId = 0;
  let migrated = existingCount || 0;
  const startTime = Date.now();
  let consecutiveErrors = 0;

  while (true) {
    // Fetch batch from old DB using cursor pagination
    const { data, error: fetchError } = await oldDb
      .from('proveedores')
      .select('id, nombre, ruc, correo, telefono, fuente')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error(`Fetch error after id ${lastId}:`, fetchError.message);
      consecutiveErrors++;
      if (consecutiveErrors > 5) break;
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    if (!data || data.length === 0) break;

    lastId = data[data.length - 1].id;

    // Remove id field before inserting (new DB generates its own ids)
    const rows = data.map(({ id, ...rest }) => rest);

    // Upsert batch into new DB
    const { error: insertError } = await newDb
      .from('proveedores')
      .upsert(rows, { onConflict: 'ruc', ignoreDuplicates: true });

    if (insertError) {
      console.error(`Insert error after id ${lastId}:`, insertError.message);
      consecutiveErrors++;
      if (consecutiveErrors > 5) break;
      // Try smaller batches
      for (let i = 0; i < rows.length; i += 200) {
        const smallBatch = rows.slice(i, i + 200);
        await newDb.from('proveedores').upsert(smallBatch, { onConflict: 'ruc', ignoreDuplicates: true });
      }
    } else {
      consecutiveErrors = 0;
    }

    migrated += data.length;

    const elapsed = (Date.now() - startTime) / 1000;
    const rate = (migrated - (existingCount || 0)) / elapsed;
    const remaining = (totalCount - migrated) / rate;

    if (migrated % 10000 < BATCH_SIZE) {
      console.log(`  ${migrated.toLocaleString()} / ${totalCount.toLocaleString()} (${((migrated/totalCount)*100).toFixed(1)}%) - ${rate.toFixed(0)} rows/s - ETA: ${(remaining/60).toFixed(1)} min`);
    }
  }

  // Final verification
  const { count: finalCount } = await newDb
    .from('proveedores')
    .select('*', { count: 'exact', head: true });

  console.log(`\nMigration complete!`);
  console.log(`New DB total: ${finalCount?.toLocaleString()}`);
}

migrate().catch(console.error);
