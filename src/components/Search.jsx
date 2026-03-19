import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDebounce } from '../hooks/useDebounce'
import { useAuth } from '../contexts/AuthContext'
import CompanyModal from './CompanyModal'
import StarRating from './StarRating'

const ITEMS_PER_PAGE = 20

export default function Search() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [activeLetter, setActiveLetter] = useState(null)
  const [page, setPage] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [ratings, setRatings] = useState({})
  const inputRef = useRef(null)
  const { user, signInWithGoogle, loading: authLoading } = useAuth()

  const debouncedQuery = useDebounce(query, 350)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Search by text query
  useEffect(() => {
    if (activeLetter) return
    if (debouncedQuery.length < 3) {
      setResults([])
      setHasSearched(false)
      setHasNextPage(false)
      return
    }

    async function search() {
      setLoading(true)
      setHasSearched(true)

      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const isRuc = /^\d{8,11}$/.test(debouncedQuery.trim())

      let q = supabase
        .from('proveedores')
        .select('nombre, ruc, correo, telefono, fuente')

      if (isRuc) {
        q = q.like('ruc', `${debouncedQuery.trim()}%`)
      } else {
        q = q.ilike('nombre', `%${debouncedQuery}%`)
      }

      const { data, error } = await q
        .order('nombre')
        .range(from, to + 1)

      if (!error && data) {
        const hasMore = data.length > ITEMS_PER_PAGE
        setResults(hasMore ? data.slice(0, ITEMS_PER_PAGE) : data)
        setHasNextPage(hasMore)
      }
      setLoading(false)
    }

    search()
  }, [debouncedQuery, activeLetter, page])

  // Search by letter
  useEffect(() => {
    if (!activeLetter) return

    async function searchByLetter() {
      setLoading(true)
      setHasSearched(true)

      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error } = await supabase
        .from('proveedores')
        .select('nombre, ruc, correo, telefono, fuente')
        .like('nombre', `${activeLetter}%`)
        .limit(ITEMS_PER_PAGE + 1)
        .range(from, to + 1)

      if (!error && data) {
        const hasMore = data.length > ITEMS_PER_PAGE
        setResults(hasMore ? data.slice(0, ITEMS_PER_PAGE) : data)
        setHasNextPage(hasMore)
      }
      setLoading(false)
    }

    searchByLetter()
  }, [activeLetter, page])

  const handleLetterClick = (letter) => {
    setQuery('')
    setPage(0)
    setActiveLetter(letter === activeLetter ? null : letter)
  }

  // Fetch ratings for current results
  useEffect(() => {
    if (results.length === 0) return
    const rucs = results.map(r => r.ruc)
    supabase.from('company_ratings').select('*').in('ruc', rucs).then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(r => { map[r.ruc] = r })
        setRatings(map)
      }
    })
  }, [results])

  const hasContact = (company) => company.correo || company.telefono

  const openCompany = async (company) => {
    const { data } = await supabase
      .from('proveedores')
      .select('actividad_economica, tipo_contribuyente, direccion, departamento, provincia, distrito, estado, condicion')
      .eq('ruc', company.ruc)
      .single()

    setSelectedCompany({ ...company, ...(data || {}) })
  }

  // Auth gate — if not logged in, show login wall
  if (!authLoading && !user) {
    return (
      <section className="relative min-h-screen bg-surface">
        <div className="pt-40 pb-8 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-[Manrope] text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tighter mb-4">
              Directorio de Empresas
            </h1>
            <p className="text-on-surface-muted text-base max-w-xl mx-auto mb-6">
              Explora más de 845,000 empresas peruanas registradas
            </p>

            {/* Blurred search bar (decorative) */}
            <div className="relative max-w-2xl mx-auto mb-10 opacity-40 pointer-events-none select-none">
              <div className="flex items-center bg-white rounded-[2rem] p-3 shadow-ambient">
                <div className="pl-4 pr-2">
                  <span className="material-symbols-outlined text-outline text-xl">search</span>
                </div>
                <span className="py-3 px-3 text-outline/50 text-lg">Busca por nombre de empresa o RUC...</span>
              </div>
            </div>

            {/* Login CTA */}
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-ambient animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-accent text-3xl">lock</span>
              </div>
              <h2 className="font-[Manrope] font-bold text-xl text-navy-900 mb-2">
                Inicia sesión para buscar
              </h2>
              <p className="text-on-surface-muted text-sm mb-6 max-w-xs mx-auto">
                Regístrate gratis con tu cuenta de Google para acceder al directorio completo de empresas.
              </p>
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-navy-900 hover:bg-navy-900/90
                           text-white font-[Manrope] font-bold text-sm py-4 px-6 rounded-2xl
                           transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              <p className="text-outline text-xs mt-4">
                Es gratis y solo toma 2 segundos
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen bg-surface">
      {/* Hero header */}
      <div className="pt-40 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-[Manrope] text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tighter mb-4">
            Directorio de Empresas
          </h1>
          <p className="text-on-surface-muted text-base max-w-xl mx-auto mb-10">
            Explora más de 845,000 empresas peruanas registradas
          </p>

          {/* Search bar */}
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/15 to-navy-900/5 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-white rounded-[2rem] p-3 shadow-ambient">
              <div className="pl-4 pr-2">
                {loading ? (
                  <svg className="w-5 h-5 text-accent animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-outline text-xl">search</span>
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveLetter(null); setPage(0) }}
                placeholder="Busca por nombre de empresa o RUC..."
                className="w-full py-3 px-3 bg-transparent text-on-surface text-lg font-medium
                           placeholder:text-outline/50 outline-none border-none focus:ring-0"
              />

              {query && (
                <button
                  onClick={() => { setQuery(''); setPage(0); inputRef.current?.focus() }}
                  className="pr-4 pl-2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Trending badges */}
          {!hasSearched && !activeLetter && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-outline">Tendencias:</span>
              {['Restaurantes', 'Construcción', 'Tecnología', 'Abogados', 'Transporte', 'Minería', 'Salud', 'Educación', 'Contabilidad', 'Inmobiliarias'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setActiveLetter(null); setPage(0); setQuery(tag) }}
                  className="px-3 py-1.5 bg-accent/10 text-navy-900 rounded-full text-xs font-bold
                             hover:bg-accent/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Alphabet filter — horizontal scrollable strip */}
          <div className="mt-6 relative">
            <div className="flex items-center justify-center gap-0.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline mr-2">A-Z</span>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`w-9 h-9 rounded-full font-[Manrope] font-bold text-sm transition-all duration-200 ${
                    activeLetter === letter
                      ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'
                      : 'text-on-surface-muted hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  {letter}
                </button>
              ))}
              {activeLetter && (
                <button
                  onClick={() => { setActiveLetter(null); setPage(0); setResults([]); setHasSearched(false); setHasNextPage(false) }}
                  className="ml-1 w-9 h-9 rounded-full bg-red-50 text-red-400 shrink-0 flex items-center justify-center
                             hover:bg-red-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        {/* Status */}
        {query.length > 0 && query.length < 3 && !activeLetter && (
          <p className="text-center text-on-surface-muted text-sm mb-6 animate-fade-in">
            Escribe al menos 3 caracteres para buscar
          </p>
        )}

        {/* Results count */}
        {hasSearched && results.length > 0 && (
          <p className="text-on-surface-muted text-sm mb-6 animate-fade-in">
            {activeLetter && <span className="font-[Manrope] font-bold text-accent text-lg mr-2">{activeLetter}</span>}
            {results.length} resultado{results.length !== 1 ? 's' : ''}
            {page > 0 && <span className="text-outline"> · Página {page + 1}</span>}
          </p>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((company, i) => (
                <button
                  key={company.ruc}
                  onClick={() => openCompany(company)}
                  className="w-full text-left group/card"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="relative bg-white rounded-2xl p-6 transition-all duration-300 animate-slide-up
                                  hover:shadow-ambient hover:scale-[1.02]">
                    {hasContact(company) && (
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-accent rounded-r-full" />
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-[Manrope] font-extrabold text-on-surface text-base tracking-tight truncate
                                         group-hover/card:text-accent transition-colors">
                            {company.nombre}
                          </h3>
                          <p className="text-on-surface-muted text-xs font-mono tracking-wider mt-1">
                            RUC {company.ruc}
                          </p>
                        </div>
                        {hasContact(company) && (
                          <span className="shrink-0 ml-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Contacto
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {ratings[company.ruc] ? (
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={Number(ratings[company.ruc].avg_rating)} readOnly size="sm" />
                            <span className="text-xs text-on-surface-muted font-medium">
                              {ratings[company.ruc].avg_rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-outline text-[10px]">Sin calificaciones</span>
                        )}
                        <span className="text-on-surface-muted text-xs group-hover/card:text-accent transition-colors flex items-center gap-1">
                          Ver perfil
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {(page > 0 || hasNextPage) && (
              <div className="mt-10 flex justify-center">
                <nav className="inline-flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-2xl shadow-ambient-sm">
                  {/* Prev */}
                  <button
                    onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === 0}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-low text-on-surface-muted
                               disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>

                  {/* Page 1 always */}
                  {page > 2 && (
                    <>
                      <button
                        onClick={() => { setPage(0); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-low font-[Manrope] font-medium text-sm"
                      >
                        1
                      </button>
                      {page > 3 && <span className="px-1 text-outline-light text-xs">···</span>}
                    </>
                  )}

                  {/* Nearby pages */}
                  {Array.from({ length: 5 }, (_, i) => page - 2 + i)
                    .filter(p => p >= 0 && (p <= page || (p === page + 1 && hasNextPage)))
                    .map(p => (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl font-[Manrope] font-bold text-sm transition-all ${
                          page === p
                            ? 'bg-navy-900 text-white shadow-md shadow-navy-900/20'
                            : 'hover:bg-surface-low text-on-surface-muted'
                        }`}
                      >
                        {p + 1}
                      </button>
                    ))
                  }

                  {/* More indicator */}
                  {hasNextPage && <span className="px-1 text-outline-light text-xs">···</span>}

                  {/* Next */}
                  <button
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={!hasNextPage}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-low text-on-surface-muted
                               disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {hasSearched && !loading && results.length === 0 && (debouncedQuery.length >= 3 || activeLetter) && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-surface-muted text-3xl">search_off</span>
            </div>
            <p className="text-on-surface-muted text-base">
              No se encontraron empresas
              {activeLetter && <> que empiecen con "<span className="text-on-surface font-medium">{activeLetter}</span>"</>}
              {debouncedQuery && <> con "<span className="text-on-surface font-medium">{debouncedQuery}</span>"</>}
            </p>
          </div>
        )}
      </div>

      {/* Company detail panel */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </section>
  )
}
