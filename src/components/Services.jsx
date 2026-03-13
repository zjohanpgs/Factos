const services = [
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: "Busca empresas",
    description: "Encuentra cualquier empresa peruana por nombre o RUC. Accede a correos, teléfonos y datos de contacto verificados de más de 845,000 empresas."
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: "Registra tu empresa gratis",
    description: "Inscribe tu empresa o negocio en nuestro directorio de forma totalmente gratuita y empieza a recibir consultas de potenciales clientes."
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "Publica tu empresa destacada",
    description: "Incluye tu logo, fotos publicitarias, opciones adicionales de contacto y aparece en los primeros lugares de búsqueda por un mínimo costo."
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Mejora tu posicionamiento SEO",
    description: "Inscribir tu empresa en directorios como Factos mejora tu posicionamiento en Google, ayudando a que potenciales clientes te encuentren más fácilmente."
  }
]

export default function Services() {
  return (
    <section id="servicios" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-[2px] bg-accent" />
          <span className="text-accent font-[Montserrat] font-semibold text-xs uppercase tracking-[0.2em]">
            Soluciones
          </span>
        </div>

        <h2 className="font-[Montserrat] text-4xl md:text-5xl text-navy-900 font-bold tracking-tight mb-4">
          ¿Qué ofrecemos?
        </h2>
        <p className="font-[Poppins] text-gray-500 text-lg max-w-2xl mb-16">
          Todo lo que necesitas para encontrar empresas o darle visibilidad a tu negocio en Perú.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-8 rounded-2xl bg-white border border-gray-100
                         hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-[Montserrat] font-bold text-navy-900 text-lg mb-2">
                  {service.title}
                </h3>
                <p className="font-[Poppins] text-gray-500 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center
                              text-gray-300 group-hover:border-accent group-hover:text-accent transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://wa.me/51932332576?text=Hola, quiero registrar mi empresa en Factos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Montserrat]
                       font-bold px-8 py-4 rounded-full transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Registra tu empresa ahora
          </a>
        </div>
      </div>
    </section>
  )
}
