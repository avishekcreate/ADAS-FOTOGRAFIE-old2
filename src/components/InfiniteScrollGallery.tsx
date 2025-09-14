import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";
import { supabase } from "@/integrations/supabase/client";

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
  id: string;
  image: string;
  title: string;
  description: string;
}

const basePhotos: Photo[] = [
  { id: "1", image: abstract1, title: "Abstract Depths", description: "Exploring form and color in digital space" },
  { id: "2", image: abstract2, title: "Geometric Flow", description: "Mathematical beauty in abstract form" },
  { id: "3", image: architecture1, title: "Urban Geometry", description: "Where concrete meets sky in perfect harmony" },
  { id: "4", image: architecture2, title: "Modern Lines", description: "Clean architectural forms against blue sky" },
  { id: "5", image: automotive1, title: "Speed & Steel", description: "Capturing the essence of automotive design" },
  { id: "6", image: interior1, title: "Intimate Spaces", description: "Light and shadow in modern interiors" },
  { id: "7", image: landscape1, title: "Natural Vista", description: "Capturing the raw beauty of untouched landscapes" },
  { id: "8", image: landscape2, title: "Horizon Dreams", description: "Where earth meets sky in perfect balance" },
  { id: "9", image: nature1, title: "Organic Forms", description: "The intricate patterns found in nature" },
  { id: "10", image: nature2, title: "Wild Beauty", description: "Untamed natural elements in their glory" },
  { id: "11", image: portrait1, title: "Human Connection", description: "Capturing the essence of personality" },
  { id: "12", image: portrait2, title: "Emotional Depth", description: "Stories told through facial expressions" },
  { id: "13", image: portrait3, title: "Character Study", description: "The art of revealing inner beauty" },
  { id: "14", image: street1, title: "Urban Pulse", description: "Life in motion on city streets" },
  { id: "15", image: street2, title: "Street Stories", description: "Candid moments in urban environments" },
  { id: "16", image: wildlife1, title: "Wild Majesty", description: "The untamed beauty of wildlife" },
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

// Generate photos from Supabase and fallback to base photos
const generatePhotosArray = async (): Promise<Photo[]> => {
  try {
    const { data: supabasePhotos, error } = await supabase
      .from('photos')
      .select('id, title, description, image_url')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (supabasePhotos && supabasePhotos.length > 0) {
      const convertedPhotos: Photo[] = supabasePhotos.map(photo => ({
        id: photo.id,
        image: photo.image_url,
        title: photo.title,
        description: photo.description || "No description available"
      }));

      // If we have photos from Supabase, repeat them to create more content
      const repeatedPhotos: Photo[] = [];
      const repetitions = Math.max(1, Math.ceil(50 / convertedPhotos.length)); // Ensure at least 50 photos
      
      for (let i = 0; i < repetitions; i++) {
        const shuffled = shuffleArray(convertedPhotos);
        shuffled.forEach((photo, index) => {
          repeatedPhotos.push({
            ...photo,
            id: `${photo.id}-${i}-${index}`,
          });
        });
      }
      
      return repeatedPhotos;
    }
  } catch (error) {
    console.error('Error fetching photos from Supabase:', error);
  }

  // Fallback to base photos if no Supabase photos or error
  const photos: Photo[] = [];
  for (let i = 0; i < 10; i++) {
    const shuffled = shuffleArray(basePhotos);
    shuffled.forEach((photo, index) => {
      photos.push({
        ...photo,
        id: `${photo.id}-fallback-${i}-${index}`,
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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const animationRef = useRef<gsap.core.Tween>(); // kept for compatibility
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  // Load photos from Supabase or fallback to static images
  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      const photosArray = await generatePhotosArray();
      setPhotos(photosArray);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !autoplay) return;

    // Kill any existing tweens before creating new ones
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    const container = containerRef.current;
    const columns = container.querySelectorAll(".column");

    columns.forEach((column, index) => {
      const el = column as HTMLElement;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      // Alternating scroll directions: down, up, down, up
      const direction = index % 2 === 0 ? 1 : -1;
      const startValue = direction === 1 ? 0 : maxScroll;
      const endValue = direction === 1 ? maxScroll : 0;

      el.scrollTop = startValue;

      const tween = gsap.to(el, {
        scrollTop: endValue,
        duration: maxScroll > 0 ? maxScroll / (autoplaySpeed * 30) : 10,
        ease: "none",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5, // Stagger the animations
      });

      tweensRef.current.push(tween);
    });

    return () => {
      tweensRef.current.forEach((t) => t.kill());
      gsap.killTweensOf(".column");
    };
  }, [autoplay, autoplaySpeed, photos.length]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      tweensRef.current.forEach((t) => t.pause());
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      tweensRef.current.forEach((t) => t.resume());
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleModalClose = () => {
    setSelectedPhoto(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading gallery...</div>
      </div>
    );
  }

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
