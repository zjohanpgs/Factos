import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim().length >= 2) {
      navigate(`/directorio?q=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/directorio')
    }
  }

  return (
    <section id="inicio" className="relative px-6 pt-44 pb-24 md:pt-52 md:pb-32 flex flex-col items-center overflow-hidden bg-surface">
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-accent/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-navy-900/5 blur-[100px] rounded-full -z-10" />

      {/* Content */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold font-[Manrope] tracking-tighter text-navy-900 leading-[1.1] mb-6">
          Encuentra las{' '}
          <span className="text-accent">845K+</span>{' '}
          mejores empresas de Perú
        </h1>
        <p className="text-lg md:text-xl text-on-surface-muted max-w-2xl mx-auto font-medium mb-12">
          El directorio empresarial más completo del Perú. Accede a datos de contacto,
          información fiscal y más.
        </p>
      </div>

      {/* Giant search bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-navy-900/10 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <div className="relative flex items-center bg-white rounded-[2rem] p-3 shadow-ambient">
          <span className="material-symbols-outlined ml-5 text-outline text-2xl">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl font-medium px-5 placeholder:text-outline/50 text-on-surface"
            placeholder="¿Qué empresa o servicio buscas?"
          />
          <button
            type="submit"
            className="bg-navy-900 text-white px-7 py-3.5 rounded-[1.5rem] font-[Manrope] font-extrabold text-base
                       hover:bg-accent transition-colors hidden md:block shrink-0"
          >
            Explorar
          </button>
        </div>
      </form>

      {/* Trending badges */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
        <span className="text-xs font-bold uppercase tracking-widest text-outline">Tendencias:</span>
        {['Restaurantes', 'Construcción', 'Tecnología', 'Abogados', 'Transporte', 'Minería', 'Salud', 'Educación', 'Contabilidad', 'Inmobiliarias'].map((tag) => (
          <button
            key={tag}
            onClick={() => { setQuery(tag); navigate(`/directorio?q=${encodeURIComponent(tag)}`) }}
            className="px-4 py-1.5 bg-accent/10 text-navy-900 rounded-full text-xs font-bold
                       hover:bg-accent/20 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  )
}
