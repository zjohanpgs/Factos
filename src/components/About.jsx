export default function About() {
  return (
    <section className="relative bg-navy-800 py-24 overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-accent/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-white/50 font-[Montserrat] text-sm uppercase tracking-widest mb-3">
            / Factos
          </p>
          <div className="w-12 h-0.5 bg-accent mb-6" />
          <h2 className="font-[Montserrat] font-bold text-3xl md:text-4xl text-white leading-tight uppercase mb-8">
            Convertimos la prospección en crecimiento real para tu empresa de factoring
          </h2>
          <div className="space-y-4 font-[Poppins] text-white/70 text-base leading-relaxed">
            <p>Un equipo comercial y operativo experto.</p>
            <p>Procesos validados con múltiples clientes.</p>
            <p>Contactos activos con los principales aceptantes del mercado.</p>
            <p>
              Nos integramos como un socio estratégico que acelera tu colocación
              de cartera y te permite enfocarte en lo que mejor sabes hacer: financiar.
            </p>
          </div>
          
          <a
            href="https://wa.me/51932332576"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Montserrat] font-bold px-8 py-4 rounded-full transition-colors text-sm uppercase tracking-wide"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contáctanos
          </a>
        </div>
        
        <div className="hidden md:block relative">
          <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-900 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-white/40 font-[Poppins] text-sm">Crecimiento sostenido</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
