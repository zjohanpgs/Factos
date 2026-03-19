import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-on-surface-muted/40 hover:text-accent hover:bg-accent/5 transition-all">
      {copied ? (
        <span className="material-symbols-outlined text-green-600 text-sm">check</span>
      ) : (
        <span className="material-symbols-outlined text-sm">content_copy</span>
      )}
    </button>
  )
}

export default function CompanyModal({ company, onClose }) {
  const [visible, setVisible] = useState(false)
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [totalReviews, setTotalReviews] = useState(0)
  const [myReview, setMyReview] = useState(null)

  const fetchReviews = useCallback(async () => {
    const [{ data: reviewsData }, { data: ratingData }] = await Promise.all([
      supabase.from('reviews').select('*').eq('ruc', company.ruc).order('created_at', { ascending: false }),
      supabase.from('company_ratings').select('*').eq('ruc', company.ruc).single()
    ])
    setReviews(reviewsData || [])
    setAvgRating(ratingData?.avg_rating || null)
    setTotalReviews(ratingData?.total_reviews || 0)
    if (user && reviewsData) {
      setMyReview(reviewsData.find(r => r.user_id === user.id) || null)
    }
  }, [company.ruc, user])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setVisible(true))
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const emails = company.correo ? company.correo.split(',').map(e => e.trim()).filter(Boolean) : []
  const phones = company.telefono ? company.telefono.split(',').map(t => t.trim()).filter(Boolean) : []
  const hasEnriched = company.actividad_economica || company.tipo_contribuyente || company.direccion

  return (
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-250 ${visible ? 'opacity-100' : 'opacity-0'}`} />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full bg-white flex flex-col shadow-2xl">

          {/* Header bar */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-surface-low">
            <div className="flex items-center gap-2">
              {company.estado && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-[Manrope] font-bold tracking-wide ${
                  company.estado === 'ACTIVO' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${company.estado === 'ACTIVO' ? 'bg-green-500' : 'bg-red-500'}`} />
                  {company.estado}
                </span>
              )}
              {company.condicion && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-[Manrope] font-bold tracking-wide ${
                  company.condicion === 'HABIDO' ? 'bg-accent/10 text-accent' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {company.condicion}
                </span>
              )}
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-high flex items-center justify-center text-on-surface-muted hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* Company name */}
            <div className="px-6 pt-6 pb-5">
              <h3 className="font-[Manrope] font-extrabold text-on-surface text-xl leading-tight tracking-tight mb-2">
                {company.nombre}
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-on-surface-muted text-sm font-mono tracking-wide">RUC {company.ruc}</span>
                <CopyButton text={company.ruc} />
              </div>
            </div>

            {/* Fiscal info */}
            {hasEnriched && (
              <div className="px-6 py-5 bg-surface-low mx-4 rounded-2xl mb-4">
                <p className="font-[Manrope] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Información fiscal
                </p>
                <div className="grid gap-4">
                  {company.actividad_economica && (
                    <div>
                      <p className="text-on-surface-muted text-[11px] mb-1">Actividad económica</p>
                      <p className="text-sm text-on-surface font-medium">{company.actividad_economica}</p>
                    </div>
                  )}
                  {company.tipo_contribuyente && (
                    <div>
                      <p className="text-on-surface-muted text-[11px] mb-1">Tipo de contribuyente</p>
                      <p className="text-sm text-on-surface font-medium">{company.tipo_contribuyente}</p>
                    </div>
                  )}
                  {company.direccion && (
                    <div>
                      <p className="text-on-surface-muted text-[11px] mb-1">Dirección fiscal</p>
                      <p className="text-sm text-on-surface font-medium">
                        {company.direccion}
                        {company.distrito && `, ${company.distrito}`}
                        {company.provincia && `, ${company.provincia}`}
                        {company.departamento && ` — ${company.departamento}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phones */}
            {phones.length > 0 && (
              <div className="px-6 py-5">
                <p className="font-[Manrope] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Teléfono{phones.length > 1 ? 's' : ''} <span className="text-on-surface-muted/40 font-normal ml-1">({phones.length})</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {phones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-1 group">
                      <a href={`tel:${phone}`} className="text-sm text-on-surface hover:text-accent transition-colors">
                        {phone}
                      </a>
                      <CopyButton text={phone} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emails */}
            {emails.length > 0 && (
              <div className="px-6 py-5">
                <p className="font-[Manrope] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                  Correo{emails.length > 1 ? 's' : ''} <span className="text-on-surface-muted/40 font-normal ml-1">({emails.length})</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-1 group min-w-0">
                      <a href={`mailto:${email}`} className="text-sm text-on-surface hover:text-accent transition-colors truncate min-w-0">
                        {email.toLowerCase()}
                      </a>
                      <CopyButton text={email.toLowerCase()} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No data */}
            {emails.length === 0 && phones.length === 0 && !hasEnriched && (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-on-surface-muted text-2xl">info</span>
                </div>
                <p className="text-on-surface-muted text-sm">Sin información disponible</p>
              </div>
            )}

            {/* Reviews section */}
            <div className="px-6 py-5 border-t border-surface-low">
              <p className="font-[Manrope] text-[11px] font-bold text-accent uppercase tracking-widest mb-4">
                Calificaciones
                {totalReviews > 0 && <span className="text-on-surface-muted/40 font-normal ml-1">({totalReviews})</span>}
              </p>

              <ReviewList reviews={reviews} avgRating={avgRating} totalReviews={totalReviews} />

              <div className="mt-4 pt-4 border-t border-surface-low">
                <ReviewForm
                  ruc={company.ruc}
                  existingReview={myReview}
                  onReviewSubmitted={fetchReviews}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
