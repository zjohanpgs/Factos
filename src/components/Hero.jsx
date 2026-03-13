import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-navy-900/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-accent font-[Montserrat] font-semibold text-xs uppercase tracking-wider">
              Directorio de empresas
            </span>
          </div>

          <h1 className="font-[Montserrat] font-black text-4xl md:text-5xl lg:text-6xl text-navy-900 leading-[1.1] mb-6">
            Directorio de empresas del Perú
          </h1>

          <p className="font-[Poppins] text-gray-500 text-lg leading-relaxed max-w-lg mb-10">
            Somos el directorio de empresas más completo en Perú.
            Registra tu empresa y obtén más clientes, o encuentra la información
            de contacto que necesitas.
          </p>

          <div className="flex flex-wrap items-center gap-4">
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
              Registra tu empresa
            </a>

            <Link
              to="/directorio"
              className="inline-flex items-center gap-2 text-navy-900 font-[Montserrat] font-bold text-sm
                         hover:text-accent transition-colors"
            >
              Buscar empresas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: Stats card */}
        <div className="hidden lg:block relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/10 to-navy-900/5 rounded-3xl blur-2xl" />

          <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
            {/* Main stat */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <p className="font-[Montserrat] font-black text-5xl text-navy-900 mb-2">845K+</p>
              <p className="font-[Poppins] text-gray-400 text-base">Empresas registradas en Perú</p>
            </div>

            <div className="h-px bg-gray-100 mb-8" />

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-10 h-10 mx-auto rounded-xl bg-orange-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="font-[Poppins] text-gray-500 text-xs">Búsqueda rápida</p>
              </div>
              <div>
                <div className="w-10 h-10 mx-auto rounded-xl bg-green-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="font-[Poppins] text-gray-500 text-xs">Registro gratis</p>
              </div>
              <div>
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <p className="font-[Poppins] text-gray-500 text-xs">Más visibilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
