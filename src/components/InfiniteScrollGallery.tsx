import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PhotoCard } from './PhotoCard';
import { PhotoModal } from './PhotoModal';

// Import all images
import abstract1 from '@/assets/abstract-1.jpg';
import abstract2 from '@/assets/abstract-2.jpg';
import architecture1 from '@/assets/architecture-1.jpg';
import architecture2 from '@/assets/architecture-2.jpg';
import automotive1 from '@/assets/automotive-1.jpg';
import interior1 from '@/assets/interior-1.jpg';
import landscape1 from '@/assets/landscape-1.jpg';
import landscape2 from '@/assets/landscape-2.jpg';
import nature1 from '@/assets/nature-1.jpg';
import nature2 from '@/assets/nature-2.jpg';
import portrait1 from '@/assets/portrait-1.jpg';
import portrait2 from '@/assets/portrait-2.jpg';
import portrait3 from '@/assets/portrait-3.jpg';
import street1 from '@/assets/street-1.jpg';
import street2 from '@/assets/street-2.jpg';
import wildlife1 from '@/assets/wildlife-1.jpg';

interface Photo {
  id: number;
  image: string;
  title: string;
  description: string;
}

const basePhotos: Photo[] = [
  { id: 1, image: abstract1, title: "Abstract Depths", description: "Exploring form and color in digital space" },
  { id: 2, image: abstract2, title: "Geometric Flow", description: "Mathematical beauty in abstract form" },
  { id: 3, image: architecture1, title: "Urban Geometry", description: "Where concrete meets sky in perfect harmony" },
  { id: 4, image: architecture2, title: "Modern Lines", description: "Clean architectural forms against blue sky" },
  { id: 5, image: automotive1, title: "Speed & Steel", description: "Capturing the essence of automotive design" },
  { id: 6, image: interior1, title: "Intimate Spaces", description: "Light and shadow in modern interiors" },
  { id: 7, image: landscape1, title: "Natural Vista", description: "Capturing the raw beauty of untouched landscapes" },
  { id: 8, image: landscape2, title: "Horizon Dreams", description: "Where earth meets sky in perfect balance" },
  { id: 9, image: nature1, title: "Organic Forms", description: "The intricate patterns found in nature" },
  { id: 10, image: nature2, title: "Wild Beauty", description: "Untamed natural elements in their glory" },
  { id: 11, image: portrait1, title: "Human Connection", description: "Capturing the essence of personality" },
  { id: 12, image: portrait2, title: "Emotional Depth", description: "Stories told through facial expressions" },
  { id: 13, image: portrait3, title: "Character Study", description: "The art of revealing inner beauty" },
  { id: 14, image: street1, title: "Urban Pulse", description: "Life in motion on city streets" },
  { id: 15, image: street2, title: "Street Stories", description: "Candid moments in urban environments" },
  { id: 16, image: wildlife1, title: "Wild Majesty", description: "The untamed beauty of wildlife" }
];

// Function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate infinite photos by shuffling and repeating
const generateInfinitePhotos = (count: number): Photo[] => {
  const photos: Photo[] = [];
  for (let i = 0; i < count; i++) {
    const shuffled = shuffleArray(basePhotos);
    shuffled.forEach((photo, index) => {
      photos.push({
        ...photo,
        id: i * basePhotos.length + index + 1
      });
    });
  }
  return photos;
};

interface InfiniteScrollGalleryProps {
  autoplay?: boolean;
  autoplaySpeed?: number;
  pauseOnHover?: boolean;
}

export const InfiniteScrollGallery: React.FC<InfiniteScrollGalleryProps> = ({
  autoplay = true,
  autoplaySpeed = 1,
  pauseOnHover = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos] = useState(() => generateInfinitePhotos(10)); // Generate 160 photos (10 * 16)
  const animationRef = useRef<gsap.core.Tween>();

  useEffect(() => {
    if (!containerRef.current || !autoplay) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    // Create infinite scroll animation
    animationRef.current = gsap.to(container, {
      scrollTop: maxScroll,
      duration: maxScroll / (autoplaySpeed * 50), // Adjust speed
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        // Reset to top when reaching bottom
        container.scrollTop = 0;
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [autoplay, autoplaySpeed]);

  const handleMouseEnter = () => {
    if (pauseOnHover && animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && animationRef.current) {
      animationRef.current.resume();
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleModalClose = () => {
    setSelectedPhoto(null);
  };

  // Distribute photos into 4 columns with different heights
  const columnPhotos = [
    photos.filter((_, index) => index % 4 === 0),
    photos.filter((_, index) => index % 4 === 1),
    photos.filter((_, index) => index % 4 === 2),
    photos.filter((_, index) => index % 4 === 3)
  ];

  return (
    <>
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto scrollbar-hide"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columnPhotos.map((columnItems, columnIndex) => (
              <div key={columnIndex} className="space-y-6">
                {columnItems.map((photo, photoIndex) => (
                  <div
                    key={photo.id}
                    style={{
                      height: `${Math.random() * 200 + 300}px` // Random heights between 300-500px
                    }}
                  >
                    <PhotoCard
                      image={photo.image}
                      title={photo.title}
                      description={photo.description}
                      onClick={() => handlePhotoClick(photo)}
                      animationClass={`animate-vertical-float-${(columnIndex % 4) + 1}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          isOpen={true}
          image={selectedPhoto.image}
          title={selectedPhoto.title}
          description={selectedPhoto.description}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};