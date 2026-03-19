import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <footer id="contacto" className="bg-navy-900">
      {/* CTA section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-white/10">
          <h2 className="font-[Montserrat] font-bold text-2xl md:text-3xl text-white leading-tight max-w-md">
            ¿Quieres que tu empresa aparezca en nuestro directorio?
          </h2>
          <a
            href="https://wa.me/51961744256"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-[Montserrat]
                       font-bold px-8 py-4 rounded-full transition-colors text-sm shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contáctanos por WhatsApp
          </a>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/Rucly.png" alt="Rucly" className="h-16 w-auto brightness-0 invert" />
            </div>
            <p className="font-[Poppins] text-white/40 text-sm leading-relaxed">
              El directorio de empresas más completo del Perú.
            </p>
          </div>

          <div>
            <h4 className="font-[Montserrat] font-bold text-white text-sm mb-4">Soluciones</h4>
            <ul className="space-y-3 font-[Poppins] text-white/40 text-sm">
              <li><Link to="/directorio" className="hover:text-accent transition-colors">Buscar empresas</Link></li>
              <li><a href="#servicios" className="hover:text-accent transition-colors">Registrar empresa</a></li>
              <li><a href="#servicios" className="hover:text-accent transition-colors">Empresa destacada</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[Montserrat] font-bold text-white text-sm mb-4">Empresa</h4>
            <ul className="space-y-3 font-[Poppins] text-white/40 text-sm">
              <li><a href="#inicio" className="hover:text-accent transition-colors">Inicio</a></li>
              <li><a href="#buscar" className="hover:text-accent transition-colors">Buscador</a></li>
              <li><a href="#contacto" className="hover:text-accent transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[Montserrat] font-bold text-white text-sm mb-4">Contacto</h4>
            <ul className="space-y-3 font-[Poppins] text-white/40 text-sm">
              <li>+51 961 744 256</li>
              <li>gerencia@rucly.pe</li>
              <li className="flex items-center gap-3 pt-2">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white/40 hover:text-accent transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://wa.me/51961744256" target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-full bg-white/5 hover:bg-green-500/20 flex items-center justify-center text-white/40 hover:text-green-400 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Poppins] text-white/20 text-sm">
            &copy; {new Date().getFullYear()} Rucly. Todos los derechos reservados.
          </p>
          <p className="font-[Poppins] text-white/20 text-xs">Lima, Perú</p>
        </div>
      </div>
    </footer>
  )
}
