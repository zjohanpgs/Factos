/**
 * Crear tabla 'proveedores' en Supabase via SQL
 * Usa la misma instancia de Supabase de Merca (zjohanpgs)
 */

const SUPABASE_URL = 'https://epbvcgfwoxdtapzrhedp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYnZjZ2Z3b3hkdGFwenJoZWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjQ5NzIsImV4cCI6MjA4ODg0MDk3Mn0.FsDvN0fzkJ91jbcJTzFglLCriGI_yrQ_AtV6KMoBSZY';

async function checkTable() {
  // Intentar leer de la tabla para ver si existe
  const res = await fetch(`${SUPABASE_URL}/rest/v1/proveedores?select=count&limit=0`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
  
  if (res.status === 404 || text.includes('does not exist')) {
    console.log('\nTabla "proveedores" NO existe. Necesitas crearla en el dashboard de Supabase.');
    console.log('SQL para crear la tabla:\n');
    console.log(`
CREATE TABLE proveedores (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  ruc VARCHAR(11) NOT NULL UNIQUE,
  correo TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  fuente VARCHAR(20) DEFAULT 'OSCE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_proveedores_ruc ON proveedores(ruc);
CREATE INDEX idx_proveedores_correo ON proveedores(correo) WHERE correo != '';
CREATE INDEX idx_proveedores_fuente ON proveedores(fuente);

-- Habilitar RLS pero permitir lectura pública
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública proveedores" ON proveedores FOR SELECT USING (true);
CREATE POLICY "Insert con service key" ON proveedores FOR INSERT WITH CHECK (true);
CREATE POLICY "Update con service key" ON proveedores FOR UPDATE USING (true);
    `);
  } else {
    console.log('\nTabla "proveedores" ya existe!');
  }
}

checkTable().catch(console.error);
