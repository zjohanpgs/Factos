import { Link } from 'react-router-dom'
import BannerBar from '../components/BannerBar'
import Services from '../components/Services'
import Contact from '../components/Contact'

export default function Servicios() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <BannerBar />
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Rucly.png" alt="Rucly" className="h-20 w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-500 hover:text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Inicio</Link>
              <Link to="/servicios" className="text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide">Servicios</Link>
              <Link to="/directorio" className="text-gray-500 hover:text-navy-900 font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Directorio</Link>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/51961744256"
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

      {/* Spacer for fixed navbar */}
      <div className="pt-36" />

      {/* Services component */}
      <Services />

      {/* Footer */}
      <Contact />
    </div>
  )
}
