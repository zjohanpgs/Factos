import { Link } from 'react-router-dom'
/* Fonts updated to Manrope/Inter via Authority Ledger redesign */

const steps = [
  {
    number: '01',
    icon: (
      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Busca',
    description: 'Encuentra cualquier empresa peruana por nombre o RUC. Accede a correos, teléfonos y datos de contacto de más de 845,000 empresas.'
  },
  {
    number: '02',
    icon: (
      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: 'Regístrate',
    description: 'Inscribe tu empresa o negocio en nuestro directorio de forma totalmente gratuita y empieza a recibir consultas de potenciales clientes.'
  },
  {
    number: '03',
    icon: (
      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Destácate',
    description: 'Incluye tu logo, fotos publicitarias y opciones adicionales de contacto. Aparece en los primeros lugares de búsqueda por un mínimo costo.'
  },
  {
    number: '04',
    icon: (
      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Conecta',
    description: 'Mejora tu posicionamiento en Google y recibe consultas de potenciales clientes que buscan servicios como los tuyos.'
  }
]

export default function Services() {
  return (
    <div>
      {/* Hero / Concepto */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-[Manrope] font-semibold text-xs uppercase tracking-[0.2em]">
              Nuestros servicios
            </span>
            <div className="w-8 h-[2px] bg-accent" />
          </div>

          <h2 className="font-[Manrope] text-3xl md:text-4xl lg:text-5xl text-navy-900 font-bold tracking-tight mb-6">
            Haz crecer tu negocio con Rucly
          </h2>
          <p className="font-[Inter] text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Conectamos empresas con clientes potenciales. Busca información de contacto de cualquier empresa peruana
            o registra tu negocio para que te encuentren.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/51961744256?text=Hola, quiero registrar mi empresa en Rucly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Manrope]
                         font-bold px-8 py-4 rounded-full transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Registra tu empresa
            </a>
            <Link
              to="/directorio"
              className="inline-flex items-center gap-2 text-navy-900 font-[Manrope] font-bold text-sm
                         hover:text-accent transition-colors"
            >
              Buscar empresas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Flujo Zigzag — ¿Cómo funciona? */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-[Manrope] text-3xl md:text-4xl text-navy-900 font-bold tracking-tight mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="font-[Inter] text-gray-500 text-base max-w-xl mx-auto">
              En 4 simples pasos puedes encontrar empresas o hacer que te encuentren.
            </p>
          </div>

          {/* Zigzag flow */}
          <div className="relative">
            {/* Vertical connector line — mobile */}
            <div className="md:hidden absolute left-8 top-0 bottom-0 w-px bg-accent/20" />

            {steps.map((step, i) => {
              const isRight = i % 2 !== 0
              const isLast = i === steps.length - 1

              return (
                <div key={i} className="relative">
                  {/* Step row */}
                  <div className={`flex items-start gap-6 md:gap-0 ${
                    isRight ? 'md:flex-row-reverse' : ''
                  }`}>

                    {/* Card side */}
                    <div className={`flex-1 md:w-5/12 ${isRight ? 'md:text-right' : ''}`}>
                      <div className={`bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg
                                       hover:shadow-gray-100/80 transition-all duration-300 group ${
                        isRight ? 'md:ml-auto' : 'md:mr-auto'
                      } md:max-w-md`}>
                        <div className={`flex items-center gap-4 mb-4 ${isRight ? 'md:flex-row-reverse' : ''}`}>
                          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0
                                          group-hover:bg-accent/20 transition-colors">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className="font-[Manrope] font-bold text-navy-900 text-xl">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className={`font-[Inter] text-gray-500 leading-relaxed text-sm ${
                          isRight ? 'md:text-right' : ''
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Center node — desktop only */}
                    <div className="hidden md:flex flex-col items-center w-2/12 shrink-0">
                      <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center
                                      font-[Manrope] font-bold text-lg shadow-lg shadow-accent/30 z-10">
                        {step.number}
                      </div>
                    </div>

                    {/* Empty side — desktop only */}
                    <div className="hidden md:block flex-1 md:w-5/12" />
                  </div>

                  {/* Mobile number badge */}
                  <div className="md:hidden absolute left-4 top-8 w-8 h-8 rounded-full bg-accent text-white
                                  flex items-center justify-center font-[Manrope] font-bold text-xs z-10">
                    {step.number}
                  </div>

                  {/* Connector line between steps — desktop */}
                  {!isLast && (
                    <div className="hidden md:block relative h-16">
                      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-accent/20" />
                      {/* Arrow */}
                      <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
                        <svg className="w-4 h-4 text-accent/40" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 12l-4-4h8z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Mobile spacer */}
                  {!isLast && <div className="md:hidden h-6" />}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[Manrope] text-3xl md:text-4xl text-white font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="font-[Inter] text-white/50 text-base mb-10 max-w-lg mx-auto">
            Registra tu empresa hoy y empieza a recibir consultas de potenciales clientes en todo el Perú.
          </p>
          <a
            href="https://wa.me/51961744256?text=Hola, quiero registrar mi empresa en Rucly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Manrope]
                       font-bold px-10 py-5 rounded-full transition-colors text-base"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Registra tu empresa ahora
          </a>
        </div>
      </section>
    </div>
  )
}
