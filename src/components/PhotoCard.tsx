import { useState } from 'react';

interface PhotoCardProps {
  image: string;
  title: string;
  description: string;
  animationClass?: string;
  onClick: () => void;
}

export const PhotoCard = ({ image, title, description, animationClass = '', onClick }: PhotoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`photo-card group cursor-pointer ${animationClass} ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-surface-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Hover overlay — hidden by default, slides up on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="px-4 py-5 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Title — bold and big */}
            <h3 className="text-white font-bold text-xl tracking-wide mb-2 leading-tight">
              {title}
            </h3>
            {/* Description — max 2 lines then ... */}
            <p className="text-white/75 text-xs leading-relaxed line-clamp-2">
              {description}
            </p>
            <p className="text-white/40 text-xs mt-2">
              Click to view full →
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
