import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

const DEPARTAMENTOS = [
  'AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA',
  'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN',
  'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS',
  'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA',
  'TUMBES', 'UCAYALI'
]

const TIPOS_CONTRIBUYENTE = [
  'PERSONA NATURAL', 'SOCIEDAD ANONIMA CERRADA', 'SOCIEDAD ANONIMA',
  'EMPRESA INDIVIDUAL DE RESP. LTDA', 'SOCIEDAD COMERCIAL DE RESP. LTDA',
  'ASOCIACION', 'FUNDACION', 'COOPERATIVA', 'OTRO'
]

export default function Registrar() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    ruc: '',
    nombre: '',
    actividad_economica: '',
    tipo_contribuyente: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    telefono: '',
    correo: '',
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateRuc = () => {
    const ruc = form.ruc.trim()
    if (!/^\d{11}$/.test(ruc)) {
      setError('El RUC debe tener exactamente 11 dígitos')
      return false
    }
    if (!ruc.startsWith('10') && !ruc.startsWith('20') && !ruc.startsWith('15') && !ruc.startsWith('17')) {
      setError('El RUC no tiene un prefijo válido')
      return false
    }
    return true
  }

  const [checkingRuc, setCheckingRuc] = useState(false)

  const handleNext = async () => {
    if (step === 1) {
      if (!validateRuc()) return
      if (!form.nombre.trim()) {
        setError('Ingresa la razón social de tu empresa')
        return
      }
      // Check if RUC already exists
      setCheckingRuc(true)
      const { data } = await supabase
        .from('proveedores')
        .select('ruc, nombre')
        .eq('ruc', form.ruc.trim())
        .single()
      setCheckingRuc(false)
      if (data) {
        setError(`Este RUC ya está registrado como "${data.nombre}"`)
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!form.departamento) {
        setError('Selecciona un departamento')
        return
      }
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    if (!form.telefono.trim() && !form.correo.trim()) {
      setError('Ingresa al menos un teléfono o correo de contacto')
      return
    }

    setSubmitting(true)
    setError('')

    const { error: dbError } = await supabase
      .from('proveedores')
      .upsert({
        ruc: form.ruc.trim(),
        nombre: form.nombre.trim().toUpperCase(),
        actividad_economica: form.actividad_economica.trim().toUpperCase() || null,
        tipo_contribuyente: form.tipo_contribuyente || null,
        direccion: form.direccion.trim().toUpperCase() || null,
        departamento: form.departamento || null,
        provincia: form.provincia.trim().toUpperCase() || null,
        distrito: form.distrito.trim().toUpperCase() || null,
        telefono: form.telefono.trim() || null,
        correo: form.correo.trim().toLowerCase() || null,
        estado: 'ACTIVO',
        condicion: 'HABIDO',
        fuente: 'registro_usuario',
      }, { onConflict: 'ruc' })

    setSubmitting(false)

    if (dbError) {
      setError('Error al registrar. Intenta de nuevo.')
      console.error(dbError)
    } else {
      setSuccess(true)
    }
  }

  // Login gate
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-40 pb-8 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-[Manrope] text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tighter mb-4">
              Registra tu Empresa
            </h1>
            <p className="text-on-surface-muted text-base max-w-xl mx-auto mb-6">
              Agrega tu negocio al directorio de más de 845,000 empresas peruanas
            </p>

            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-ambient animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-accent text-3xl">store</span>
              </div>
              <h2 className="font-[Manrope] font-bold text-xl text-navy-900 mb-2">
                Inicia sesión para registrar
              </h2>
              <p className="text-on-surface-muted text-sm mb-6 max-w-xs mx-auto">
                Necesitas una cuenta de Google para registrar tu empresa en Rucly.
              </p>
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-navy-900 hover:bg-navy-900/90
                           text-white font-[Manrope] font-bold text-sm py-4 px-6 rounded-2xl
                           transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              <p className="text-outline text-xs mt-4">
                Es gratis y solo toma 2 segundos
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-40 pb-8 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-3xl p-10 shadow-ambient">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
              </div>
              <h2 className="font-[Manrope] font-extrabold text-2xl text-navy-900 mb-3">
                ¡Empresa registrada!
              </h2>
              <p className="text-on-surface-muted mb-2">
                <strong>{form.nombre.toUpperCase()}</strong> ya está en el directorio de Rucly.
              </p>
              <p className="text-on-surface-muted text-sm mb-8">
                RUC: {form.ruc}
              </p>
              <div className="flex gap-3 justify-center">
                <a href="/directorio" className="bg-accent text-white px-6 py-3 rounded-2xl font-[Manrope] font-bold text-sm hover:scale-[1.02] transition-transform">
                  Ver en Directorio
                </a>
                <button
                  onClick={() => { setSuccess(false); setStep(1); setForm({ ruc: '', nombre: '', actividad_economica: '', tipo_contribuyente: '', direccion: '', departamento: '', provincia: '', distrito: '', telefono: '', correo: '' }) }}
                  className="bg-surface-low text-navy-900 px-6 py-3 rounded-2xl font-[Manrope] font-bold text-sm hover:scale-[1.02] transition-transform"
                >
                  Registrar otra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-40 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-[Manrope] text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tighter mb-2 text-center">
            Registra tu Empresa
          </h1>
          <p className="text-on-surface-muted text-center mb-10">
            Completa los datos de tu negocio para aparecer en el directorio
          </p>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-[Manrope] font-bold text-sm transition-all
                  ${s <= step ? 'bg-accent text-white' : 'bg-surface-low text-outline'}`}>
                  {s < step ? <span className="material-symbols-outlined text-lg">check</span> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-accent' : 'bg-surface-low'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-ambient">
            {/* Step 1: RUC + Nombre */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-[Manrope] font-bold text-lg text-navy-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">badge</span>
                  Datos de la Empresa
                </h2>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">RUC *</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={form.ruc}
                    onChange={e => updateField('ruc', e.target.value.replace(/\D/g, ''))}
                    placeholder="20XXXXXXXXX"
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent font-mono text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Razón Social *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => updateField('nombre', e.target.value)}
                    placeholder="Mi Empresa S.A.C."
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Tipo de Contribuyente</label>
                  <select
                    value={form.tipo_contribuyente}
                    onChange={e => updateField('tipo_contribuyente', e.target.value)}
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    {TIPOS_CONTRIBUYENTE.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Actividad Económica</label>
                  <input
                    type="text"
                    value={form.actividad_economica}
                    onChange={e => updateField('actividad_economica', e.target.value)}
                    placeholder="Ej: Venta de ropa, Construcción, Consultoría..."
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Ubicación */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-[Manrope] font-bold text-lg text-navy-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">location_on</span>
                  Ubicación
                </h2>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Departamento *</label>
                  <select
                    value={form.departamento}
                    onChange={e => updateField('departamento', e.target.value)}
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Provincia</label>
                  <input
                    type="text"
                    value={form.provincia}
                    onChange={e => updateField('provincia', e.target.value)}
                    placeholder="Ej: Lima, Arequipa, Trujillo..."
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Distrito</label>
                  <input
                    type="text"
                    value={form.distrito}
                    onChange={e => updateField('distrito', e.target.value)}
                    placeholder="Ej: Miraflores, San Isidro..."
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={e => updateField('direccion', e.target.value)}
                    placeholder="Av. Ejemplo 123, Oficina 401"
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contacto */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-[Manrope] font-bold text-lg text-navy-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">call</span>
                  Datos de Contacto
                </h2>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={e => updateField('telefono', e.target.value)}
                    placeholder="987654321"
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-outline mt-1.5">Puedes agregar varios separados por coma</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={e => updateField('correo', e.target.value)}
                    placeholder="contacto@miempresa.com"
                    className="w-full px-5 py-4 bg-surface-low rounded-2xl text-navy-900 placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-outline mt-1.5">Puedes agregar varios separados por coma</p>
                </div>

                <div className="bg-accent/5 rounded-2xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-xl mt-0.5">info</span>
                  <p className="text-sm text-navy-900/70">
                    Al menos un teléfono o correo es obligatorio para que los clientes puedan contactarte.
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-navy-900/60 hover:text-navy-900 font-[Manrope] font-bold text-sm py-3 px-5 rounded-2xl transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Anterior
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={checkingRuc}
                  className="flex items-center gap-2 bg-accent text-white font-[Manrope] font-bold text-sm py-4 px-8 rounded-2xl
                             hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {checkingRuc ? 'Verificando RUC...' : 'Siguiente'}
                  <span className="material-symbols-outlined text-lg">{checkingRuc ? 'hourglass_top' : 'arrow_forward'}</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-accent text-white font-[Manrope] font-bold text-sm py-4 px-8 rounded-2xl
                             hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? 'Registrando...' : 'Registrar Empresa'}
                  <span className="material-symbols-outlined text-lg">{submitting ? 'hourglass_top' : 'rocket_launch'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
