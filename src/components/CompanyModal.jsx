import { useEffect, useState } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-white/25 hover:text-accent hover:bg-white/5 transition-all">
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  )
}

export default function CompanyModal({ company, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setVisible(true))
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const emails = company.correo ? company.correo.split(',').map(e => e.trim()).filter(Boolean) : []
  const phones = company.telefono ? company.telefono.split(',').map(t => t.trim()).filter(Boolean) : []
  const hasEnriched = company.actividad_economica || company.tipo_contribuyente || company.direccion

  return (
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-250 ${visible ? 'opacity-100' : 'opacity-0'}`} />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full bg-navy-900 border-l border-white/[0.08] flex flex-col shadow-2xl">

          {/* Header bar */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              {company.estado && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-[Montserrat] font-bold tracking-wide ${
                  company.estado === 'ACTIVO' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${company.estado === 'ACTIVO' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {company.estado}
                </span>
              )}
              {company.condicion && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-[Montserrat] font-bold tracking-wide ${
                  company.condicion === 'HABIDO' ? 'bg-accent/10 text-accent' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {company.condicion}
                </span>
              )}
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* Company name */}
            <div className="px-6 pt-6 pb-5 border-b border-white/[0.04]">
              <h3 className="font-[Montserrat] font-bold text-white text-xl leading-tight mb-2">
                {company.nombre}
              </h3>
              <div className="flex items-center gap-1">
                <span className="font-[Poppins] text-white/40 text-sm font-mono tracking-wide">RUC {company.ruc}</span>
                <CopyButton text={company.ruc} />
              </div>
            </div>

            {/* Fiscal info */}
            {hasEnriched && (
              <div className="px-6 py-5 border-b border-white/[0.04]">
                <p className="font-[Montserrat] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Información fiscal
                </p>
                <div className="grid gap-4">
                  {company.actividad_economica && (
                    <div>
                      <p className="font-[Poppins] text-white/30 text-[11px] mb-1">Actividad económica</p>
                      <p className="font-[Poppins] text-sm text-white/80">{company.actividad_economica}</p>
                    </div>
                  )}
                  {company.tipo_contribuyente && (
                    <div>
                      <p className="font-[Poppins] text-white/30 text-[11px] mb-1">Tipo de contribuyente</p>
                      <p className="font-[Poppins] text-sm text-white/80">{company.tipo_contribuyente}</p>
                    </div>
                  )}
                  {company.direccion && (
                    <div>
                      <p className="font-[Poppins] text-white/30 text-[11px] mb-1">Dirección fiscal</p>
                      <p className="font-[Poppins] text-sm text-white/80">
                        {company.direccion}
                        {company.distrito && `, ${company.distrito}`}
                        {company.provincia && `, ${company.provincia}`}
                        {company.departamento && ` — ${company.departamento}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phones — ALL */}
            {phones.length > 0 && (
              <div className="px-6 py-5 border-b border-white/[0.04]">
                <p className="font-[Montserrat] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Teléfono{phones.length > 1 ? 's' : ''} <span className="text-white/20 font-normal ml-1">({phones.length})</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {phones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-1 group">
                      <a href={`tel:${phone}`} className="font-[Poppins] text-sm text-white/60 hover:text-accent transition-colors">
                        {phone}
                      </a>
                      <CopyButton text={phone} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emails — ALL */}
            {emails.length > 0 && (
              <div className="px-6 py-5 border-b border-white/[0.04]">
                <p className="font-[Montserrat] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Correo{emails.length > 1 ? 's' : ''} <span className="text-white/20 font-normal ml-1">({emails.length})</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-1 group min-w-0">
                      <a href={`mailto:${email}`} className="font-[Poppins] text-sm text-white/60 hover:text-accent transition-colors truncate min-w-0">
                        {email.toLowerCase()}
                      </a>
                      <CopyButton text={email.toLowerCase()} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No contact */}
            {emails.length === 0 && phones.length === 0 && !hasEnriched && (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <p className="font-[Poppins] text-white/25 text-sm">Sin información disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
