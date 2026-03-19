import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import BannerBar from './BannerBar'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signInWithGoogle, signOut } = useAuth()

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/directorio', label: 'Directorio' },
  ]

  return (
    <div className="fixed top-0 w-full z-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-ambient transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Rucly.png" alt="Rucly" className="h-11 md:h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-[Manrope] tracking-tight text-sm font-semibold transition-colors ${
                  isActive(to) ? 'text-accent border-b-2 border-accent pb-1' : 'text-on-surface-muted hover:text-navy-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Auth button */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full ring-2 ring-accent/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">{(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}</span>
                    </div>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg shadow-black/10 py-2 opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <p className="px-4 py-1.5 text-xs font-[Manrope] font-semibold text-on-surface truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <hr className="my-1 border-surface-container" />
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-[Manrope] font-medium"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="hidden md:inline-flex items-center gap-2 bg-surface-low hover:bg-surface-container
                           px-4 py-2 rounded-xl font-[Manrope] font-semibold text-xs text-on-surface-muted
                           hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined text-base">person</span>
                Iniciar sesión
              </button>
            )}

            {/* CTA — visible on all sizes */}
            <a
              href="https://wa.me/51961744256"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl
                         font-[Manrope] font-bold text-xs md:text-sm hover:scale-105 transition-all active:opacity-80 shrink-0"
            >
              <span className="hidden sm:inline">Contáctanos</span>
              <span className="sm:hidden material-symbols-outlined text-lg">call</span>
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center
                         text-on-surface hover:bg-surface-high transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-outline-light/20 animate-slide-up">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`font-[Manrope] font-semibold text-base py-3 px-4 rounded-xl transition-colors ${
                    isActive(to) ? 'text-accent bg-accent/5' : 'text-on-surface hover:bg-surface-low'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { signInWithGoogle(); setMenuOpen(false) }}
                  className="mt-1 flex items-center justify-center gap-2 bg-surface-container text-on-surface py-3 px-6 rounded-xl
                             font-[Manrope] font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Iniciar sesión con Google
                </button>
              )}
              <a
                href="https://wa.me/51961744256"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 bg-accent text-white py-3 px-6 rounded-xl
                           font-[Manrope] font-bold text-sm"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
      <BannerBar />
    </div>
  )
}
