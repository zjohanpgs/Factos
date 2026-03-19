/**
 * Upload enrichment CSV to Supabase
 * Reads enrichment_ready.csv and updates proveedores table
 * Throttled for Supabase free tier stability
 */

import fs from 'fs'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_PATH = path.join(__dirname, 'output', 'enrichment_ready.csv')
const PROGRESS_PATH = path.join(__dirname, 'output', 'upload_progress.json')

const supabase = createClient(
  'https://ymvwkvnshsfzmtcyjhcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltdndrdm5zaHNmem10Y3lqaGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyNDIxNSwiZXhwIjoyMDg5MDAwMjE1fQ.GgmPWUsR666Gm2zrthpWG4b6ey0WkEIoVchTq7QXGBo'
)

const PARALLEL = 5
const BATCH_SIZE = 100
const DELAY_BETWEEN_BATCHES = 300
const RETRY_DELAY = 15000

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++ }
      else if (ch === '"') { inQuotes = false }
      else { current += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { result.push(current); current = '' }
      else { current += ch }
    }
  }
  result.push(current)
  return result
}

async function updateRow(ruc, data, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase
      .from('proveedores')
      .update(data)
      .eq('ruc', ruc)

    if (!error) return null

    if (attempt < retries) {
      await sleep(RETRY_DELAY * attempt)
    } else {
      return error.message
    }
  }
}

async function main() {
  console.log('=== Upload Enrichment CSV to Supabase ===\n')

  // Load progress
  let startLine = 0
  let uploaded = 0
  let errors = 0
  if (fs.existsSync(PROGRESS_PATH)) {
    const prog = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'))
    startLine = prog.line || 0
    uploaded = prog.uploaded || 0
    errors = prog.errors || 0
    console.log(`Retomando desde línea ${startLine.toLocaleString()} (${uploaded.toLocaleString()} subidos)\n`)
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, 'utf-8'),
    crlfDelay: Infinity
  })

  let lineNum = 0
  let headers = null
  let batch = []
  const startTime = Date.now()

  for await (const line of rl) {
    if (!headers) { headers = parseCSVLine(line); continue }
    lineNum++

    // Skip already processed
    if (lineNum <= startLine) continue

    const cols = parseCSVLine(line)
    const ruc = cols[0]
    if (!ruc) continue

    const data = {}
    if (cols[1]) data.estado = cols[1]
    if (cols[2]) data.condicion = cols[2]
    if (cols[3]) data.tipo_contribuyente = cols[3]
    if (cols[4]) data.actividad_economica = cols[4]
    if (cols[5]) data.departamento = cols[5]
    if (cols[6]) data.provincia = cols[6]
    if (cols[7]) data.distrito = cols[7]
    if (cols[8]) data.ubigeo = cols[8]
    if (cols[9]) data.comercio_exterior = cols[9]
    if (cols[10]) data.nro_trabajadores = cols[10]

    batch.push({ ruc, data })

    if (batch.length >= BATCH_SIZE) {
      // Process batch in parallel chunks
      for (let i = 0; i < batch.length; i += PARALLEL) {
        const chunk = batch.slice(i, i + PARALLEL)
        const results = await Promise.all(
          chunk.map(row => updateRow(row.ruc, row.data))
        )
        for (const err of results) {
          if (err) {
            errors++
            if (errors <= 5) console.log(`  Error: ${err.substring(0, 80)}`)
          } else {
            uploaded++
          }
        }
      }

      batch = []
      await sleep(DELAY_BETWEEN_BATCHES)

      // Log & save progress every 1000
      if (uploaded % 1000 < BATCH_SIZE) {
        const elapsed = (Date.now() - startTime) / 1000
        const rate = ((lineNum - startLine) / elapsed).toFixed(0)
        const remaining = (875067 - lineNum) / (rate || 1)
        let eta
        if (remaining > 3600) eta = (remaining / 3600).toFixed(1) + 'h'
        else if (remaining > 60) eta = Math.round(remaining / 60) + 'min'
        else eta = Math.round(remaining) + 's'

        console.log(
          `[${lineNum.toLocaleString()}/875,067] ` +
          `Uploaded: ${uploaded.toLocaleString()} | ` +
          `Errors: ${errors} | ` +
          `${rate}/s | ` +
          `ETA: ${eta}`
        )

        fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ line: lineNum, uploaded, errors }))
      }
    }
  }

  // Process remaining batch
  if (batch.length > 0) {
    for (let i = 0; i < batch.length; i += PARALLEL) {
      const chunk = batch.slice(i, i + PARALLEL)
      const results = await Promise.all(
        chunk.map(row => updateRow(row.ruc, row.data))
      )
      for (const err of results) {
        if (err) errors++
        else uploaded++
      }
    }
  }

  // Save final progress
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ line: lineNum, uploaded, errors, completed: true }))

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
  console.log(`\n=== COMPLETADO ===`)
  console.log(`Total líneas: ${lineNum.toLocaleString()}`)
  console.log(`Uploaded: ${uploaded.toLocaleString()}`)
  console.log(`Errors: ${errors}`)
  console.log(`Tiempo: ${totalTime} min`)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
