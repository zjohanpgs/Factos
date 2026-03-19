import StarRating from './StarRating'

export default function ReviewList({ reviews, avgRating, totalReviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-on-surface-muted text-sm">Aún no hay calificaciones</p>
        <p className="text-outline text-xs mt-1">Sé el primero en calificar esta empresa</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <span className="font-[Manrope] font-extrabold text-2xl text-on-surface">{avgRating}</span>
        <div>
          <StarRating rating={Number(avgRating)} readOnly size="sm" />
          <p className="text-outline text-xs mt-0.5">{totalReviews} calificación{totalReviews !== 1 ? 'es' : ''}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {reviews.map((review) => (
          <div key={review.id} className="bg-surface-low rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              {review.user_avatar ? (
                <img src={review.user_avatar} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-xs font-bold">
                    {(review.user_name || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-[Manrope] font-semibold text-on-surface">{review.user_name || 'Usuario'}</span>
              <div className="ml-auto">
                <StarRating rating={review.rating} readOnly size="sm" />
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-on-surface-muted pl-8">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
