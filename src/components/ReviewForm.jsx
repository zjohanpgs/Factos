import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import StarRating from './StarRating'

export default function ReviewForm({ ruc, onReviewSubmitted, existingReview }) {
  const { user, signInWithGoogle } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 bg-surface-low hover:bg-surface-container
                   rounded-xl py-3 px-4 transition-colors group"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-sm font-[Manrope] font-semibold text-on-surface-muted group-hover:text-on-surface transition-colors">
          Inicia sesión para calificar
        </span>
      </button>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return setError('Selecciona una calificación')

    setSubmitting(true)
    setError(null)

    const reviewData = {
      ruc,
      user_id: user.id,
      rating,
      comment: comment.trim(),
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
      user_avatar: user.user_metadata?.avatar_url || ''
    }

    const { error: dbError } = await supabase
      .from('reviews')
      .upsert(reviewData, { onConflict: 'ruc,user_id' })

    if (dbError) {
      setError('Error al enviar. Intenta de nuevo.')
      console.error(dbError)
    } else {
      onReviewSubmitted?.()
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-[Manrope] font-semibold text-on-surface">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </p>
        </div>
      </div>

      <StarRating rating={rating} onRate={setRating} size="lg" />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe un comentario (opcional)"
        rows={2}
        className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/50
                   outline-none border-none focus:ring-2 focus:ring-accent/20 resize-none"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-accent hover:bg-accent-hover text-white font-[Manrope] font-bold text-sm
                   py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Enviando...' : existingReview ? 'Actualizar calificación' : 'Enviar calificación'}
      </button>
    </form>
  )
}
