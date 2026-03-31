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

        {/* Always visible — title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-white font-medium text-sm tracking-wide truncate">
            {title}
          </h3>
        </div>

        {/* Hover overlay — title + truncated description */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="px-4 py-4 w-full">
            <h3 className="text-white font-medium text-sm tracking-wide mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {title}
            </h3>
            <p className="text-white/80 text-xs leading-relaxed transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
              {description}
            </p>
            <p className="text-white/50 text-xs mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
              Click to view full →
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
