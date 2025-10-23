import React from 'react';
import { Star } from 'lucide-react';

interface StarDisplayProps {
  rating: number;
  maxRating?: number;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="inline-flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;
        
        return (
          <Star
            key={index}
            className={`w-4 h-4 ${
              isActive ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill={isActive ? 'currentColor' : 'none'}
          />
        );
      })}
    </div>
  );
};