export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
            <span className="text-accent font-bold text-lg font-[Montserrat]">F</span>
          </div>
          <span className="text-white font-[Montserrat] font-bold text-xl tracking-wide">
            Factos
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-accent font-[Montserrat] font-semibold text-sm uppercase tracking-wider">Inicio</a>
          <a href="#servicios" className="text-white/80 hover:text-white font-[Montserrat] font-semibold text-sm uppercase tracking-wider transition-colors">Servicios</a>
          <a href="#contacto" className="text-white/80 hover:text-white font-[Montserrat] font-semibold text-sm uppercase tracking-wider transition-colors">Contacto</a>
        </div>
      </div>
    </nav>
  )
}
