import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDebounce } from '../hooks/useDebounce'
import CompanyModal from './CompanyModal'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef(null)

  const debouncedQuery = useDebounce(query, 350)

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([])
      setHasSearched(false)
      return
    }

    async function search() {
      setLoading(true)
      setHasSearched(true)

      const { data, error } = await supabase
        .from('proveedores')
        .select('nombre, ruc, correo, telefono, fuente')
        .ilike('nombre', `%${debouncedQuery}%`)
        .limit(20)

      if (!error && data) {
        setResults(data)
      }
      setLoading(false)
    }

    search()
  }, [debouncedQuery])

  const hasContact = (company) => company.correo || company.telefono

  return (
    <section id="buscar" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-[Montserrat] font-semibold text-sm uppercase tracking-[0.2em]">
              Buscador
            </span>
            <div className="w-8 h-[2px] bg-accent" />
          </div>
          <h2 className="font-[Montserrat] text-3xl md:text-4xl font-bold text-white mb-3">
            Encuentra cualquier empresa
          </h2>
          <p className="font-[Poppins] text-white/50 text-base max-w-xl mx-auto">
            Accede a información de más de 845,000 empresas peruanas registradas
          </p>
        </div>

        {/* Search input */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl
                          focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-300">
            {/* Search icon */}
            <div className="pl-5 pr-2">
              {loading ? (
                <svg className="w-5 h-5 text-accent animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre de empresa..."
              className="w-full py-5 px-3 bg-transparent text-white text-lg font-[Poppins] placeholder-white/30
                         outline-none"
            />

            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="pr-5 pl-2 text-white/30 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status messages */}
        {query.length > 0 && query.length < 3 && (
          <p className="text-center text-white/30 font-[Poppins] text-sm mb-6 animate-fade-in">
            Escribe al menos 3 caracteres para buscar
          </p>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-white/40 font-[Poppins] text-sm mb-4">
              {results.length === 20 ? 'Mostrando los primeros 20 resultados' : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
            </p>

            {results.map((company, i) => (
              <button
                key={company.ruc}
                onClick={() => setSelectedCompany(company)}
                className="w-full text-left group/card"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-xl p-5
                                hover:bg-white/[0.07] hover:border-accent/30
                                transition-all duration-300 animate-slide-up">
                  {/* Hover glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl
                                  opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-[Montserrat] font-bold text-white text-base truncate">
                          {company.nombre}
                        </h3>
                        {hasContact(company) && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-[Montserrat] font-semibold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Contacto
                          </span>
                        )}
                      </div>
                      <p className="font-[Poppins] text-white/40 text-sm font-mono tracking-wider">
                        RUC {company.ruc}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center
                                    group-hover/card:bg-accent/20 group-hover/card:text-accent
                                    transition-all duration-300 text-white/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Link to full directory */}
        <div className="text-center mt-8">
          <Link
            to="/directorio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-accent/40
                       text-white/50 hover:text-accent font-[Montserrat] font-semibold text-sm transition-all duration-300
                       hover:bg-accent/5"
          >
            Ver directorio completo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Empty state */}
        {hasSearched && !loading && results.length === 0 && debouncedQuery.length >= 3 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="font-[Poppins] text-white/40 text-base">
              No se encontraron empresas con "<span className="text-white/60">{debouncedQuery}</span>"
            </p>
          </div>
        )}
      </div>

      {/* Company detail modal */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </section>
  )
}
