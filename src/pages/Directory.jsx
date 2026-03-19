import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDebounce } from '../hooks/useDebounce'
import CompanyModal from '../components/CompanyModal'
import BannerBar from '../components/BannerBar'

const PAGE_SIZE = 12

export default function Directory() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const inputRef = useRef(null)

  const debouncedQuery = useDebounce(query, 350)

  useEffect(() => {
    setPage(0)
  }, [debouncedQuery])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      let q = supabase
        .from('proveedores')
        .select('nombre, ruc, correo, telefono, fuente', { count: 'exact' })

      if (debouncedQuery.length >= 2) {
        q = q.ilike('nombre', `%${debouncedQuery}%`)
      }

      q = q.order('nombre', { ascending: true })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      const { data, count, error } = await q

      if (!error && data) {
        setResults(data)
        setTotalCount(count || 0)
      }
      setLoading(false)
      setInitialLoad(false)
    }

    fetchData()
  }, [debouncedQuery, page])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const hasContact = (c) => c.correo || c.telefono

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 7
    let start = Math.max(0, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible)
    if (end - start < maxVisible) start = Math.max(0, end - maxVisible)
    for (let i = start; i < end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <BannerBar />
        <nav className="bg-navy-900/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Rucly.png" alt="Rucly" className="h-20 w-auto brightness-0 invert" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/60 hover:text-white font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Inicio</Link>
              <Link to="/buscar" className="text-white/60 hover:text-white font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Buscar</Link>
              <Link to="/servicios" className="text-white/60 hover:text-white font-[Montserrat] font-semibold text-sm tracking-wide transition-colors">Servicios</Link>
              <Link to="/directorio" className="text-white font-[Montserrat] font-semibold text-sm tracking-wide">Directorio</Link>
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

      {/* Hero gradient */}
      <div className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="font-[Montserrat] text-3xl md:text-5xl font-bold text-white mb-4">
            Encuentra una empresa
          </h1>
          <p className="font-[Poppins] text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            Busca entre más de 845,000 empresas peruanas registradas
          </p>
        </div>
      </div>

      {/* Search + content area */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-2 mb-8 flex items-center gap-2">
          <div className="pl-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca una empresa aquí"
            className="flex-1 py-3 px-3 bg-transparent text-gray-900 text-base font-[Poppins] placeholder-gray-400
                       outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button className="bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Results header */}
        {debouncedQuery.length >= 2 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[Montserrat] text-xl md:text-2xl font-bold text-navy-900">
              Resultados <span className="font-normal text-gray-400">({totalCount.toLocaleString()} empresas)</span>
            </h2>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {/* Table */}
        {!loading && results.length > 0 && (
          <>
            {/* Desktop table header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 text-xs font-[Montserrat] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200">
              <div className="col-span-4">Nombre empresa</div>
              <div className="col-span-2">RUC</div>
              <div className="col-span-3">Correo electrónico</div>
              <div className="col-span-2">Teléfono</div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {results.map((company) => (
                <button
                  key={company.ruc}
                  onClick={() => setSelectedCompany(company)}
                  className="w-full text-left group hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-5 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        {hasContact(company) && (
                          <div className="w-1 h-8 rounded-full bg-accent shrink-0" />
                        )}
                        <div>
                          <p className="font-[Montserrat] font-bold text-gray-900 text-sm">
                            {company.nombre}
                          </p>
                          {hasContact(company) && (
                            <span className="text-[11px] font-[Poppins] text-accent font-medium">
                              Con contacto
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-[Poppins] text-gray-500 text-sm font-mono">{company.ruc}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-[Poppins] text-gray-600 text-sm truncate">
                        {company.correo ? company.correo.split(',')[0].trim().toLowerCase() : '—'}
                      </p>
                      {company.correo && company.correo.includes(',') && (
                        <span className="text-[11px] text-gray-400 font-[Poppins]">
                          +{company.correo.split(',').length - 1} más
                        </span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="font-[Poppins] text-gray-600 text-sm">
                        {company.telefono ? company.telefono.split(',')[0].trim() : '—'}
                      </p>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-accent/10 group-hover:text-accent
                                      flex items-center justify-center text-gray-400 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="lg:hidden px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {hasContact(company) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          )}
                          <p className="font-[Montserrat] font-bold text-gray-900 text-sm truncate">
                            {company.nombre}
                          </p>
                        </div>
                        <p className="font-[Poppins] text-gray-400 text-xs font-mono mb-1">
                          RUC {company.ruc}
                        </p>
                        {company.correo && (
                          <p className="font-[Poppins] text-gray-500 text-xs truncate">
                            {company.correo.split(',')[0].trim().toLowerCase()}
                          </p>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-8">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400
                             hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {getPageNumbers().map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-[Montserrat] text-sm font-semibold transition-colors
                      ${p === page
                        ? 'bg-navy-900 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {p + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400
                             hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !initialLoad && results.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="font-[Poppins] text-gray-400 text-base">
              No se encontraron empresas con "<span className="text-gray-600">{debouncedQuery}</span>"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-navy-900 border-t border-navy-700">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/Rucly.png" alt="Rucly" className="h-16 w-auto brightness-0 invert" />
            <span className="text-white/60 font-[Poppins] text-sm">
              Rucly — Directorio de empresas peruanas
            </span>
          </div>
          <a
            href="https://wa.me/51961744256"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-accent font-[Poppins] text-sm transition-colors"
          >
            WhatsApp: +51 932 332 576
          </a>
        </div>
      </footer>

      {/* Modal */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  )
}
