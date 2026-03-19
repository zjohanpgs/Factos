/**
 * Enriquecimiento desde Padrón RUC Completo (datosabiertos.gob.pe)
 *
 * Cruza los RUCs de Supabase con el CSV del padrón completo.
 * No requiere API — todo local.
 *
 * Uso: node scripts/enrich-from-padron.js
 */

import fs from 'fs'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_PATH = path.join(__dirname, 'padron_completo', 'PadronRUC_202602.csv')
const PROGRESS_PATH = path.join(__dirname, 'output', 'progress_padron.json')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ymvwkvnshsfzmtcyjhcl.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdndrdm5zaHNmem10Y3lqaGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyNDIxNSwiZXhwIjoyMDg5MDAwMjE1fQ.GgmPWUsR666Gm2zrthpWG4b6ey0WkEIoVchTq7QXGBo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BATCH_SIZE = 500 // Upsert batch size
const LOG_INTERVAL = 50000 // Log every N CSV rows read

async function main() {
  console.log('=== Enriquecimiento desde Padrón RUC Completo ===\n')

  // Step 1: Get all our RUCs from Supabase
  console.log('1. Obteniendo RUCs de Supabase...')
  const ourRucs = new Set()
  const PAGE = 1000 // Supabase default max per request
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('proveedores')
      .select('ruc')
      .order('ruc')
      .range(offset, offset + PAGE - 1)

    if (error) throw new Error(`Supabase error: ${error.message}`)

    for (const row of data) {
      ourRucs.add(row.ruc)
    }
    offset += data.length
    hasMore = data.length === PAGE

    if (offset % 50000 === 0 || !hasMore) {
      console.log(`   ${ourRucs.size.toLocaleString()} RUCs leídos...`)
    }
  }

  console.log(`   Total RUCs en Supabase: ${ourRucs.size.toLocaleString()}\n`)

  // Step 2: Read padron CSV and match
  console.log('2. Leyendo Padrón Completo y cruzando datos...')
  console.log(`   Archivo: ${CSV_PATH}\n`)

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf-8' }),
    crlfDelay: Infinity
  })

  let headers = null
  let csvRow = 0
  let matched = 0
  let skipped = 0
  let batch = []
  let uploadedTotal = 0
  let errors = 0
  let resumeFromRow = 0
  const startTime = Date.now()

  // Load resume progress
  if (fs.existsSync(PROGRESS_PATH)) {
    const prog = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'))
    resumeFromRow = prog.csvRow || 0
    uploadedTotal = prog.uploaded || 0
    matched = prog.matched || 0
    errors = prog.errors || 0
    console.log(`   RETOMANDO desde fila ${resumeFromRow.toLocaleString()} (${uploadedTotal.toLocaleString()} ya subidos)\n`)
  }

  for await (const line of rl) {
    // Parse header
    if (!headers) {
      headers = line.split(',')
      console.log(`   Columnas: ${headers.join(', ')}\n`)
      continue
    }

    csvRow++

    // Skip already processed rows (resume)
    if (csvRow <= resumeFromRow) {
      if (csvRow % LOG_INTERVAL === 0) {
        process.stdout.write(`   Saltando fila ${csvRow.toLocaleString()}...\r`)
      }
      continue
    }

    // Parse CSV line (simple split — this CSV uses commas without quoting issues)
    const cols = line.split(',')
    const ruc = cols[0]

    // Skip if not in our database
    if (!ourRucs.has(ruc)) {
      skipped++
      if (csvRow % LOG_INTERVAL === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
        console.log(`   [${csvRow.toLocaleString()} filas] Matched: ${matched.toLocaleString()} | Skipped: ${skipped.toLocaleString()} | Uploaded: ${uploadedTotal.toLocaleString()} | ${elapsed}s`)
      }
      continue
    }

    matched++

    // Build enrichment data
    const actividad = cols[4] || '' // CIIU rev3 principal
    const actividadRev4 = cols[6] || '' // CIIU rev4 principal
    const enriched = {
      ruc: ruc,
      estado: cols[1] || '',
      condicion: cols[2] || '',
      tipo_contribuyente: cols[3] || '',
      actividad_economica: (actividadRev4 && actividadRev4 !== 'NO DISPONIBLE') ? actividadRev4 : (actividad !== 'NO DISPONIBLE' ? actividad : ''),
      nro_trabajadores: (cols[7] && cols[7] !== 'NO DISPONIBLE') ? cols[7] : '',
      comercio_exterior: (cols[10] && cols[10] !== 'SIN ACTIVIDAD' && cols[10] !== 'NO DISPONIBLE') ? cols[10] : '',
      ubigeo: cols[11] || '',
      departamento: cols[12] || '',
      provincia: cols[13] || '',
      distrito: cols[14] || '',
    }

    // Build direccion from padron reducido if we don't have it
    // (The completo CSV doesn't have street-level address, only ubigeo/dept/prov/dist)

    batch.push(enriched)

    // Upload batch
    if (batch.length >= BATCH_SIZE) {
      let result = await uploadBatch(batch)
      if (result.error) {
        // Retry once after waiting
        console.log(`   ⚠️ Error, reintentando en 10s...`)
        await new Promise(r => setTimeout(r, 10000))
        result = await uploadBatch(batch)
        if (result.error) {
          errors++
          console.log(`   ⚠️ Error definitivo en batch: ${result.error.substring(0, 100)}`)
        }
      }
      uploadedTotal += batch.length
      batch = []
      // Delay between batches to avoid overwhelming Supabase free tier
      await new Promise(r => setTimeout(r, 500))
    }

    if (csvRow % LOG_INTERVAL === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
      const rate = ((csvRow - resumeFromRow) / (Date.now() - startTime) * 1000).toFixed(0)
      console.log(`   [${csvRow.toLocaleString()} filas] Matched: ${matched.toLocaleString()} | Uploaded: ${uploadedTotal.toLocaleString()} | ${rate} filas/s | ${elapsed}s`)
      // Save progress
      fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ csvRow, matched, uploaded: uploadedTotal, errors }))
    }
  }

  // Upload remaining batch
  if (batch.length > 0) {
    await uploadBatch(batch)
    uploadedTotal += batch.length
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log(`\n=== COMPLETADO ===`)
  console.log(`CSV filas leídas: ${csvRow.toLocaleString()}`)
  console.log(`Empresas encontradas: ${matched.toLocaleString()}`)
  console.log(`Empresas actualizadas: ${uploadedTotal.toLocaleString()}`)
  console.log(`Errores: ${errors}`)
  console.log(`Tiempo: ${totalTime}s`)
}

async function uploadBatch(batch, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Use individual updates since we're updating existing rows
      // Batch them in chunks to avoid overwhelming Supabase
      const promises = []

      for (const row of batch) {
        const updateData = {}
        if (row.estado) updateData.estado = row.estado
        if (row.condicion) updateData.condicion = row.condicion
        if (row.tipo_contribuyente) updateData.tipo_contribuyente = row.tipo_contribuyente
        if (row.actividad_economica) updateData.actividad_economica = row.actividad_economica
        if (row.nro_trabajadores) updateData.nro_trabajadores = row.nro_trabajadores
        if (row.comercio_exterior) updateData.comercio_exterior = row.comercio_exterior
        if (row.ubigeo) updateData.ubigeo = row.ubigeo
        if (row.departamento) updateData.departamento = row.departamento
        if (row.provincia) updateData.provincia = row.provincia
        if (row.distrito) updateData.distrito = row.distrito

        promises.push(
          supabase
            .from('proveedores')
            .update(updateData)
            .eq('ruc', row.ruc)
        )
      }

      // Execute in parallel chunks of 10 with delay
      const CHUNK = 10
      for (let i = 0; i < promises.length; i += CHUNK) {
        const chunk = promises.slice(i, i + CHUNK)
        const results = await Promise.all(chunk)
        const err = results.find(r => r.error)
        if (err?.error) {
          return { error: err.error.message }
        }
        // Small delay between chunks to avoid overwhelming Supabase
        if (i + CHUNK < promises.length) {
          await new Promise(r => setTimeout(r, 100))
        }
      }

      return { error: null }
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 2000 * attempt))
      } else {
        return { error: err.message }
      }
    }
  }
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
