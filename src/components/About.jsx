export default function About() {
  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-[Montserrat] font-semibold text-xs uppercase tracking-[0.2em]">
              Sobre nosotros
            </span>
          </div>

          <h2 className="font-[Montserrat] font-bold text-3xl md:text-4xl text-navy-900 leading-tight mb-8">
            El directorio de empresas más completo del Perú
          </h2>

          <div className="space-y-4 font-[Poppins] text-gray-500 text-base leading-relaxed">
            <p>
              En nuestro sitio encontrarás empresas y negocios de todos los sectores,
              con información de contacto verificada directamente de fuentes oficiales.
            </p>
            <p>
              ¿Eres propietario de un negocio o gerente de una empresa en Perú
              y todavía no estás en nuestro directorio?
            </p>
            <p>
              Puedes inscribir tu empresa de forma gratuita. Además, por un mínimo costo
              podrás incluir tu logo, fotos publicitarias, opciones adicionales de contacto
              y aparecer en los primeros lugares de búsqueda.
            </p>
            <p>
              Estar en directorios como Rucly mejora tu posicionamiento en buscadores como Google,
              ayudando a que potenciales clientes encuentren tu negocio.
            </p>
          </div>

          <a
            href="https://wa.me/51961744256?text=Hola, quiero inscribir mi empresa en Rucly"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Montserrat]
                       font-bold px-8 py-4 rounded-full transition-colors text-sm"
          >
            Inscribe tu empresa gratis
          </a>
        </div>

        <div className="hidden md:block relative">
          <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
          <div className="relative bg-gray-50 rounded-3xl border border-gray-100 p-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <p className="font-[Montserrat] font-bold text-navy-900 text-xl mb-2">Visibilidad nacional</p>
              <p className="font-[Poppins] text-gray-400 text-sm">Más clientes encuentran tu negocio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
