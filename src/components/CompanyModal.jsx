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
    <button
      onClick={handleCopy}
      className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10
                 text-white/30 hover:text-white text-[11px] font-[Poppins] transition-all duration-200"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">Copiado</span>
        </>
      ) : (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  )
}

export default function CompanyModal({ company, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const emails = company.correo ? company.correo.split(',').map(e => e.trim()).filter(Boolean) : []
  const phones = company.telefono ? company.telefono.split(',').map(t => t.trim()).filter(Boolean) : []
  const hasContact = emails.length > 0 || phones.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={onClose}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full max-w-lg my-8 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-accent/10 rounded-3xl blur-2xl" />

        <div className="relative bg-navy-800/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10
                       flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {/* Company icon */}
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>

            {/* Company name */}
            <h3 className="font-[Montserrat] font-bold text-white text-2xl uppercase leading-tight mb-6">
              {company.nombre}
            </h3>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-6" />

            {/* All info sections with same style */}
            <div className="space-y-5">
              {/* RUC */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                  <span className="font-[Montserrat] text-white/50 text-xs font-semibold uppercase tracking-wider">
                    RUC
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-[Poppins] text-sm text-white/70 font-mono tracking-wider">
                    {company.ruc}
                  </span>
                  <CopyButton text={company.ruc} />
                </div>
              </div>

              {/* Emails */}
              {emails.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span className="font-[Montserrat] text-white/50 text-xs font-semibold uppercase tracking-wider">
                      Correo{emails.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {emails.slice(0, 5).map((email, i) => (
                      <div key={i} className="flex items-center gap-2 group/item">
                        <a
                          href={`mailto:${email}`}
                          className="font-[Poppins] text-sm text-white/70 hover:text-accent transition-colors duration-200 truncate min-w-0"
                        >
                          {email.toLowerCase()}
                        </a>
                        <CopyButton text={email.toLowerCase()} />
                      </div>
                    ))}
                    {emails.length > 5 && (
                      <p className="font-[Poppins] text-white/30 text-xs">
                        +{emails.length - 5} correo{emails.length - 5 > 1 ? 's' : ''} más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Phones */}
              {phones.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span className="font-[Montserrat] text-white/50 text-xs font-semibold uppercase tracking-wider">
                      Teléfono{phones.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {phones.slice(0, 4).map((phone, i) => (
                      <div key={i} className="flex items-center gap-2 group/item">
                        <a
                          href={`tel:${phone}`}
                          className="font-[Poppins] text-sm text-white/70 hover:text-accent transition-colors duration-200"
                        >
                          {phone}
                        </a>
                        <CopyButton text={phone} />
                      </div>
                    ))}
                    {phones.length > 4 && (
                      <p className="font-[Poppins] text-white/30 text-xs">
                        +{phones.length - 4} teléfono{phones.length - 4 > 1 ? 's' : ''} más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* No contact */}
              {!hasContact && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <p className="font-[Poppins] text-white/30 text-sm mb-4">
                    Información de contacto no disponible
                  </p>
                  <a
                    href="https://wa.me/51932332576?text=Hola, necesito información de contacto de una empresa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover
                               text-white font-[Montserrat] font-bold text-sm transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.593-.838-6.325-2.236l-.442-.366-3.237 1.085 1.085-3.237-.366-.442A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    Solicitar contacto
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
