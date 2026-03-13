-- ============================================
-- Migración: Agregar campos de enriquecimiento
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Nuevos campos de enriquecimiento SUNAT
ALTER TABLE proveedores
  ADD COLUMN IF NOT EXISTS actividad_economica TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tipo_contribuyente TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS fecha_inscripcion TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS direccion TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS departamento TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS provincia TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS distrito TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS ubigeo VARCHAR(6) DEFAULT '',
  ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS condicion TEXT DEFAULT '';

-- Índices para búsqueda por nuevos campos
CREATE INDEX IF NOT EXISTS idx_proveedores_actividad ON proveedores(actividad_economica) WHERE actividad_economica != '';
CREATE INDEX IF NOT EXISTS idx_proveedores_departamento ON proveedores(departamento) WHERE departamento != '';
CREATE INDEX IF NOT EXISTS idx_proveedores_distrito ON proveedores(distrito) WHERE distrito != '';

-- Índice para búsqueda por nombre (text search pattern)
CREATE INDEX IF NOT EXISTS idx_proveedores_nombre_trgm ON proveedores USING gin (nombre gin_trgm_ops);
-- Nota: Si el índice trigram falla, ejecutar primero: CREATE EXTENSION IF NOT EXISTS pg_trgm;
