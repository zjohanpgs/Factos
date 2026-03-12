const services = [
  {
    title: "Originación de leads calificados",
    description: "Te entregamos leads verificados e interesados, listos para ser contactados por tu equipo comercial.",
    items: [
      { 
        icon: "🎯", 
        heading: "¿Qué hacemos?",
        text: "Nos encargamos de identificar, contactar y calificar a los proveedores que ya cuentan con facturas por cobrar, alineados a tus criterios de riesgo y aceptantes."
      },
      { 
        icon: "🤝", 
        heading: "Tú negocias. Nosotros hacemos el resto",
        bullets: [
          "Te evitamos semanas de búsqueda improductiva.",
          "Aceleramos tu colocación de cartera.",
          "Mejoramos la eficiencia de tus funcionarios."
        ]
      },
      { 
        icon: "✅", 
        heading: "Proceso probado",
        text: "Operativo experto, red activa con los principales aceptantes del mercado."
      }
    ]
  },
  {
    title: "Tercerización total del proceso comercial",
    description: "Gestionamos todo el ciclo comercial de factoring por ti: desde la búsqueda del proveedor hasta el desembolso efectivo.",
    checklist: [
      "Buscamos y validamos proveedores con interés genuino en financiarse.",
      "Realizamos el primer contacto, presentamos tu producto y gestionamos la calificación.",
      "Acompañamos todo el proceso: onboarding, firma digital, envío de documentos y seguimiento.",
      "Gestionamos directamente con el proveedor hasta concretar el desembolso.",
      "Nuestro equipo trabaja con metas claras de colocación, no solo de intención.",
      "También aseguramos la relación post-desembolso, para impulsar recurrencia."
    ]
  }
]

export default function Services() {
  return (
    <section id="servicios" className="bg-navy-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-12 h-0.5 bg-accent mb-6" />
        <h2 className="font-[Montserrat] text-5xl md:text-6xl text-white font-light tracking-tight mb-16">
          SERVICIOS
        </h2>

        <div className="space-y-24">
          {/* Servicio 1: Leads */}
          <div>
            <h3 className="font-[Montserrat] font-bold text-xl md:text-2xl text-white uppercase mb-4">
              {services[0].title}
            </h3>
            <p className="font-[Poppins] text-white/60 mb-10 max-w-2xl">
              {services[0].description}
            </p>
            <div className="space-y-8">
              {services[0].items.map((item, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-xl bg-navy-700 border border-white/10 flex items-center justify-center flex-shrink-0 text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-[Montserrat] font-bold text-white text-lg uppercase mb-2">
                      {item.heading}
                    </h4>
                    {item.text && (
                      <p className="font-[Poppins] text-white/60 leading-relaxed">
                        {item.text}
                      </p>
                    )}
                    {item.bullets && (
                      <ul className="space-y-1 font-[Poppins] text-white/60">
                        {item.bullets.map((b, j) => (
                          <li key={j}>- {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Servicio 2: Tercerización */}
          <div>
            <p className="text-white/50 font-[Montserrat] text-sm uppercase tracking-widest mb-3">
              Factos
            </p>
            <div className="w-12 h-0.5 bg-accent mb-6" />
            <h3 className="font-[Montserrat] font-light text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
              {services[1].title}
            </h3>
            <p className="font-[Poppins] text-white/60 mb-10 max-w-2xl">
              {services[1].description}
            </p>
            <div className="space-y-5">
              {services[1].checklist.map((item, i) => (
                <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-5">
                  <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-[Poppins] text-white/70 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            
            <a
              href="https://wa.me/51932332576"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Montserrat] font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
