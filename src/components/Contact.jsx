import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <footer id="contacto" className="bg-navy-900 text-white">
      <div className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & description */}
          <div className="md:col-span-2 space-y-4">
            <img src="/Rucly.png" alt="Rucly" className="h-12 w-auto brightness-0 invert" />
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              El directorio empresarial más completo del Perú. Conectamos empresas con clientes potenciales.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://wa.me/51961744256"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent/20 transition-colors"
              >
                <span className="material-symbols-outlined text-white/60 text-xl">share</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-[Manrope] font-bold text-sm text-white/80 uppercase tracking-wider">Soluciones</h4>
            <div className="flex flex-col gap-3">
              <Link to="/directorio" className="text-white/40 text-sm hover:text-white transition-colors">Directorio</Link>
              <Link to="/servicios" className="text-white/40 text-sm hover:text-white transition-colors">Servicios</Link>
              <a href="https://wa.me/51961744256?text=Quiero registrar mi empresa" target="_blank" rel="noopener noreferrer" className="text-white/40 text-sm hover:text-white transition-colors">Registrar empresa</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-[Manrope] font-bold text-sm text-white/80 uppercase tracking-wider">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+51961744256" className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-base">call</span>
                +51 961 744 256
              </a>
              <a href="mailto:gerencia@rucly.pe" className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                gerencia@rucly.pe
              </a>
              <p className="text-white/40 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">location_on</span>
                Lima, Perú
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs">© 2026 Rucly.pe — Directorio de Empresas del Perú</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">Privacidad</a>
            <a href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
