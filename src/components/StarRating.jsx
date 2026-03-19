import { useState } from 'react'

export default function StarRating({ rating = 0, onRate, size = 'md', readOnly = false }) {
  const [hovered, setHovered] = useState(0)

  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = hovered ? star <= hovered : star <= Math.round(rating)
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`${sizes[size]} transition-colors ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${filled ? 'text-amber-400' : 'text-gray-200'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}>
              star
            </span>
          </button>
        )
      })}
    </div>
  )
}
