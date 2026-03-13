import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMPTY_BANNER = {
  empresa_nombre: '',
  slogan: '',
  enlace: '',
  logo_url: '',
  imagen_fondo: '',
  color_fondo: '#e94d24',
  color_texto: '#ffffff',
  fecha_inicio: '',
  fecha_fin: '',
  prioridad: 0,
  activo: true,
}

export default function Admin() {
  const [banners, setBanners] = useState([])
  const [editing, setEditing] = useState(null) // null = list, object = form
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    setLoading(true)
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('prioridad', { ascending: false })
    if (data) setBanners(data)
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      empresa_nombre: editing.empresa_nombre,
      slogan: editing.slogan,
      enlace: editing.enlace,
      logo_url: editing.logo_url,
      imagen_fondo: editing.imagen_fondo,
      color_fondo: editing.color_fondo,
      color_texto: editing.color_texto,
      fecha_inicio: editing.fecha_inicio || null,
      fecha_fin: editing.fecha_fin || null,
      prioridad: parseInt(editing.prioridad) || 0,
      activo: editing.activo,
    }

    let error
    if (editing.id) {
      ({ error } = await supabase.from('banners').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('banners').insert(payload))
    }

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(editing.id ? 'Banner actualizado' : 'Banner creado')
      setEditing(null)
      fetchBanners()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    fetchBanners()
  }

  async function toggleActive(banner) {
    await supabase.from('banners').update({ activo: !banner.activo }).eq('id', banner.id)
    fetchBanners()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-navy-900 border-b border-navy-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
                <span className="text-accent font-bold text-lg font-[Montserrat]">F</span>
              </div>
              <span className="text-white font-[Montserrat] font-bold text-xl tracking-wide">
                Factos
              </span>
            </Link>
            <span className="text-white/30 font-[Poppins] text-sm">/ Admin</span>
          </div>
          <Link
            to="/directorio"
            className="text-white/60 hover:text-white font-[Poppins] text-sm transition-colors"
          >
            Ver directorio
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[Montserrat] text-2xl font-bold text-navy-900">
            Gestión de Banners
          </h1>
          {!editing && banners.length < 3 && (
            <button
              onClick={() => setEditing({ ...EMPTY_BANNER })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover
                         text-white font-[Montserrat] font-bold text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo banner
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-[Poppins] ${
            message.startsWith('Error')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        {editing && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="font-[Montserrat] font-bold text-lg text-navy-900 mb-6">
              {editing.id ? 'Editar banner' : 'Nuevo banner'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nombre empresa *" required>
                <input
                  type="text"
                  value={editing.empresa_nombre}
                  onChange={e => setEditing({ ...editing, empresa_nombre: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Ej: Mi Empresa S.A.C."
                />
              </Field>

              <Field label="Slogan / Texto">
                <input
                  type="text"
                  value={editing.slogan}
                  onChange={e => setEditing({ ...editing, slogan: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Los mejores servicios"
                />
              </Field>

              <Field label="Enlace (URL o WhatsApp)">
                <input
                  type="text"
                  value={editing.enlace}
                  onChange={e => setEditing({ ...editing, enlace: e.target.value })}
                  className="input-field"
                  placeholder="https://... o https://wa.me/51..."
                />
              </Field>

              <Field label="URL del logo">
                <input
                  type="text"
                  value={editing.logo_url}
                  onChange={e => setEditing({ ...editing, logo_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </Field>

              <Field label="URL imagen de fondo">
                <input
                  type="text"
                  value={editing.imagen_fondo}
                  onChange={e => setEditing({ ...editing, imagen_fondo: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Color fondo">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editing.color_fondo}
                      onChange={e => setEditing({ ...editing, color_fondo: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editing.color_fondo}
                      onChange={e => setEditing({ ...editing, color_fondo: e.target.value })}
                      className="input-field flex-1"
                    />
                  </div>
                </Field>

                <Field label="Color texto">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editing.color_texto}
                      onChange={e => setEditing({ ...editing, color_texto: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editing.color_texto}
                      onChange={e => setEditing({ ...editing, color_texto: e.target.value })}
                      className="input-field flex-1"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Fecha inicio (opcional)">
                <input
                  type="datetime-local"
                  value={editing.fecha_inicio ? editing.fecha_inicio.slice(0, 16) : ''}
                  onChange={e => setEditing({ ...editing, fecha_inicio: e.target.value })}
                  className="input-field"
                />
              </Field>

              <Field label="Fecha fin (opcional)">
                <input
                  type="datetime-local"
                  value={editing.fecha_fin ? editing.fecha_fin.slice(0, 16) : ''}
                  onChange={e => setEditing({ ...editing, fecha_fin: e.target.value })}
                  className="input-field"
                />
              </Field>

              <Field label="Prioridad (mayor = primero)">
                <input
                  type="number"
                  value={editing.prioridad}
                  onChange={e => setEditing({ ...editing, prioridad: e.target.value })}
                  className="input-field"
                  min="0"
                  max="99"
                />
              </Field>

              <Field label="Estado">
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      editing.activo ? 'bg-accent' : 'bg-gray-300'
                    }`}
                    onClick={() => setEditing({ ...editing, activo: !editing.activo })}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      editing.activo ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="font-[Poppins] text-sm text-gray-600">
                    {editing.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </Field>
            </div>

            {/* Preview */}
            <div className="mt-6 mb-6">
              <p className="font-[Montserrat] text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Vista previa
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: editing.color_fondo || '#e94d24',
                  backgroundImage: editing.imagen_fondo ? `url(${editing.imagen_fondo})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {editing.imagen_fondo && <div className="absolute inset-0 bg-black/40" />}
                <div className="relative px-6 py-2.5 flex items-center justify-center gap-3">
                  {editing.logo_url && (
                    <img src={editing.logo_url} alt="" className="w-6 h-6 rounded object-contain" />
                  )}
                  <span
                    className="font-[Poppins] text-sm font-medium"
                    style={{ color: editing.color_texto || '#ffffff' }}
                  >
                    <span className="font-bold font-[Montserrat]">
                      {editing.empresa_nombre || 'Nombre empresa'}
                    </span>
                    {editing.slogan && ` — ${editing.slogan}`}
                  </span>
                  <svg
                    className="w-4 h-4"
                    style={{ color: editing.color_texto || '#ffffff' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-[Montserrat]
                           font-bold text-sm transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (editing.id ? 'Actualizar' : 'Crear banner')}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(null); setMessage('') }}
                className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-[Montserrat]
                           font-bold text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Banner list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {banners.length === 0 && !editing && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="font-[Poppins] text-gray-400">No hay banners creados</p>
              </div>
            )}

            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Color stripe */}
                <div className="h-1" style={{ backgroundColor: banner.color_fondo }} />

                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-[Montserrat] font-bold text-navy-900 truncate">
                        {banner.empresa_nombre}
                      </h3>
                      <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-[Poppins] font-medium ${
                        banner.activo
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {banner.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    {banner.slogan && (
                      <p className="font-[Poppins] text-gray-500 text-sm truncate">{banner.slogan}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs font-[Poppins] text-gray-400">
                      <span>Prioridad: {banner.prioridad}</span>
                      {banner.fecha_inicio && (
                        <span>Desde: {new Date(banner.fecha_inicio).toLocaleDateString()}</span>
                      )}
                      {banner.fecha_fin && (
                        <span>Hasta: {new Date(banner.fecha_fin).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(banner)}
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center
                                 text-gray-400 hover:text-gray-600 transition-colors"
                      title={banner.activo ? 'Desactivar' : 'Activar'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {banner.activo ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setEditing({ ...banner, fecha_inicio: banner.fecha_inicio || '', fecha_fin: banner.fecha_fin || '' })}
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center
                                 text-gray-400 hover:text-accent transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 flex items-center justify-center
                                 text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {banners.length >= 3 && !editing && (
              <p className="text-center font-[Poppins] text-gray-400 text-sm py-2">
                Máximo 3 banners alcanzado
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #e94d24;
          box-shadow: 0 0 0 3px rgba(233, 77, 36, 0.1);
        }
        .input-field::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block font-[Montserrat] text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
