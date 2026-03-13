import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const MAX_BANNERS = 3

export default function BannerBar() {
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    async function fetchBanners() {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('activo', true)
        .or(`fecha_inicio.is.null,fecha_inicio.lte.${now}`)
        .or(`fecha_fin.is.null,fecha_fin.gte.${now}`)
        .order('prioridad', { ascending: false })
        .limit(MAX_BANNERS)

      if (data) setBanners(data)
    }
    fetchBanners()
  }, [])

  // Auto-rotate if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [banners.length])

  if (banners.length === 0) return null

  const banner = banners[current]

  return (
    <div
      className="relative overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: banner.color_fondo || '#e94d24',
        backgroundImage: banner.imagen_fondo ? `url(${banner.imagen_fondo})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability when background image */}
      {banner.imagen_fondo && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <div className="relative max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-4">
        {/* Logo */}
        {banner.logo_url && (
          <img
            src={banner.logo_url}
            alt={banner.empresa_nombre}
            className="w-6 h-6 rounded object-contain"
          />
        )}

        {/* Content */}
        <a
          href={banner.enlace || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <span
            className="font-[Poppins] text-sm font-medium transition-opacity group-hover:opacity-80"
            style={{ color: banner.color_texto || '#ffffff' }}
          >
            <span className="font-bold font-[Montserrat]">{banner.empresa_nombre}</span>
            {banner.slogan && (
              <span className="hidden sm:inline"> — {banner.slogan}</span>
            )}
          </span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: banner.color_texto || '#ffffff' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Dots indicator for multiple banners */}
        {banners.length > 1 && (
          <div className="flex items-center gap-1.5 ml-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: banner.color_texto || '#ffffff',
                  opacity: i === current ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
