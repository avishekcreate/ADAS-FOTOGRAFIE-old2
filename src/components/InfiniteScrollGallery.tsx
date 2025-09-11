import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";

// Import all images
import abstract1 from "@/assets/abstract-1.jpg";
import abstract2 from "@/assets/abstract-2.jpg";
import architecture1 from "@/assets/architecture-1.jpg";
import architecture2 from "@/assets/architecture-2.jpg";
import automotive1 from "@/assets/automotive-1.jpg";
import interior1 from "@/assets/interior-1.jpg";
import landscape1 from "@/assets/landscape-1.jpg";
import landscape2 from "@/assets/landscape-2.jpg";
import nature1 from "@/assets/nature-1.jpg";
import nature2 from "@/assets/nature-2.jpg";
import portrait1 from "@/assets/portrait-1.jpg";
import portrait2 from "@/assets/portrait-2.jpg";
import portrait3 from "@/assets/portrait-3.jpg";
import street1 from "@/assets/street-1.jpg";
import street2 from "@/assets/street-2.jpg";
import wildlife1 from "@/assets/wildlife-1.jpg";

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
  { id: 16, image: wildlife1, title: "Wild Majesty", description: "The untamed beauty of wildlife" },
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
        id: i * basePhotos.length + index + 1,
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
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos] = useState(() => generateInfinitePhotos(10)); // Generate 160 photos (10 * 16)
  const animationRef = useRef<gsap.core.Tween>();

  useEffect(() => {
    if (!containerRef.current || !autoplay) return;

    const container = containerRef.current;
    const columns = container.querySelectorAll(".column");

    columns.forEach((column, index) => {
      const scrollHeight = column.scrollHeight;
      const clientHeight = column.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Alternating scroll directions: down, up, down, up
      const direction = index % 2 === 0 ? 1 : -1;
      const startValue = direction === 1 ? 0 : maxScroll;
      const endValue = direction === 1 ? maxScroll : 0;

      column.scrollTop = startValue;

      gsap.to(column, {
        scrollTop: endValue,
        duration: maxScroll / (autoplaySpeed * 30),
        ease: "none",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5, // Stagger the animations
      });
    });

    return () => {
      gsap.killTweensOf(".column");
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

  // Distribute photos into 4 columns
  const columnPhotos = [
    photos.filter((_, index) => index % 4 === 0),
    photos.filter((_, index) => index % 4 === 1),
    photos.filter((_, index) => index % 4 === 2),
    photos.filter((_, index) => index % 4 === 3),
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-6 py-8 relative">
          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-screen">
            {columnPhotos.map((columnItems, columnIndex) => (
              <div
                key={columnIndex}
                className="column overflow-y-auto scrollbar-hide h-full"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="flex flex-col gap-6 pb-96">
                  {columnItems.map((photo) => (
                    <div key={photo.id} className="flex-shrink-0">
                      <PhotoCard
                        image={photo.image}
                        title={photo.title}
                        description={photo.description}
                        onClick={() => handlePhotoClick(photo)}
                        animationClass=""
                      />
                    </div>
                  ))}
                </div>
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
