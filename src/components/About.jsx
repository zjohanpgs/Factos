export default function About() {
  return (
    <section className="bg-navy-900 text-white py-16 md:py-28 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Benefits */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest">
            Beneficios Premium
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold font-[Manrope] leading-[1.1] tracking-tight">
            Haz que tu negocio destaque en el radar.
          </h2>

          <p className="text-white/60 text-lg max-w-lg">
            Registra tu empresa en Rucly y llega a miles de potenciales clientes que buscan servicios como los tuyos.
          </p>

          <ul className="space-y-6">
            {[
              { icon: 'verified', title: 'Sello de Verificación', desc: 'Tu empresa aparece con badge de verificada, generando confianza inmediata.' },
              { icon: 'trending_up', title: 'Posicionamiento SEO', desc: 'Mejora tu posición en Google al estar listado en un directorio de autoridad.' },
              { icon: 'visibility', title: 'Mayor Visibilidad', desc: 'Aparece en los primeros resultados cuando busquen empresas de tu rubro.' },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-accent text-xl">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-[Manrope]">{item.title}</h4>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/51961744256?text=Hola, quiero registrar mi empresa en Rucly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 rounded-2xl font-[Manrope] font-black text-lg
                       hover:scale-105 transition-transform shadow-xl"
          >
            Registrar mi Negocio
            <span className="material-symbols-outlined">rocket_launch</span>
          </a>
        </div>

        {/* Right — Stats card mock */}
        <div className="relative hidden lg:block">
          <div className="relative z-10 bg-white text-on-surface p-8 rounded-[2.5rem] shadow-2xl space-y-6 max-w-md ml-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <img src="/Rucly.png" alt="Rucly" className="h-8 w-auto" />
              </div>
              <div>
                <h5 className="font-bold font-[Manrope]">Rucly Business</h5>
                <p className="text-xs text-on-surface-muted">Estadísticas de la última semana</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-low rounded-2xl">
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Visitas</p>
                <p className="text-2xl font-black text-navy-900 font-[Manrope]">+2.4k</p>
              </div>
              <div className="p-4 bg-surface-low rounded-2xl">
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Clics</p>
                <p className="text-2xl font-black text-accent font-[Manrope]">842</p>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="h-20 w-full bg-gradient-to-t from-accent/5 to-transparent rounded-xl flex items-end px-2 gap-1.5">
              {[40, 60, 45, 75, 55, 90, 70, 100, 80, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${h}%`,
                    background: i === 9 ? '#2BBCB3' : i >= 7 ? '#2BBCB3aa' : '#2BBCB340'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Decorative layers */}
          <div className="absolute top-8 right-8 w-full h-full bg-accent/5 rounded-[2.5rem] -rotate-3 -z-10" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  )
}
