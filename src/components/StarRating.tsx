import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: string;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = 'w-4 h-4', 
  interactive = false, 
  onRate 
}: StarRatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= Math.round(rating);

        return (
          <button
            type="button"
            key={index}
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(starNumber)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
