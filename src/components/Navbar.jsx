import { Link } from 'react-router-dom'
import BannerBar from './BannerBar'

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full z-50">
      <BannerBar />
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
              <span className="text-accent font-bold text-lg font-[Montserrat]">F</span>
            </div>
            <span className="text-navy-900 font-[Montserrat] font-bold text-xl tracking-wide">
              Factos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide hover:text-accent transition-colors">Inicio</a>
            <a href="#buscar" className="text-gray-500 hover:text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Buscar</a>
            <a href="#servicios" className="text-gray-500 hover:text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Servicios</a>
            <Link to="/directorio" className="text-gray-500 hover:text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Directorio</Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/51932332576"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-accent text-accent
                         hover:bg-accent hover:text-white font-[Montserrat] font-bold text-sm transition-all duration-300"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}
