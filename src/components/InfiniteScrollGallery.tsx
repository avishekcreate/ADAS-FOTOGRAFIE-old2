import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  image: string;
  title: string;
  description: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const fetchPhotosFromSupabase = async (): Promise<Photo[]> => {
  // Reads from media_items — this is what the admin dashboard uploads to
  const { data, error } = await supabase
    .from('media_items')
    .select('id, title, description, image_path')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  const photos: Photo[] = data.map((item) => ({
    id: item.id,
    image: item.image_path,
    title: item.title,
    description: item.description || "",
  }));

  // Repeat photos to fill the infinite scroll (minimum 48)
  const repeated: Photo[] = [];
  const repetitions = Math.max(1, Math.ceil(48 / photos.length));
  for (let i = 0; i < repetitions; i++) {
    const shuffled = shuffleArray(photos);
    shuffled.forEach((photo, index) => {
      repeated.push({ ...photo, id: `${photo.id}-${i}-${index}` });
    });
  }
  return repeated;
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
  const [error, setError] = useState<string | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError(null);
      const photosArray = await fetchPhotosFromSupabase();
      if (photosArray.length === 0) {
        setError("No photos found. Please add photos via the admin dashboard.");
      }
      setPhotos(photosArray);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !autoplay || photos.length === 0) return;

    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    const container = containerRef.current;
    const columns = container.querySelectorAll(".column");

    columns.forEach((column, index) => {
      const el = column as HTMLElement;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

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
        delay: index * 0.5,
      });

      tweensRef.current.push(tween);
    });

    return () => {
      tweensRef.current.forEach((t) => t.kill());
      gsap.killTweensOf(".column");
    };
  }, [autoplay, autoplaySpeed, photos.length]);

  const handleMouseEnter = () => {
    if (pauseOnHover) tweensRef.current.forEach((t) => t.pause());
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) tweensRef.current.forEach((t) => t.resume());
  };
  const handlePhotoClick = (photo: Photo) => setSelectedPhoto(photo);
  const handleModalClose = () => setSelectedPhoto(null);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg opacity-60">Loading gallery...</div>
      </div>
    );
  }

  if (error || photos.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 opacity-60">
        <div className="text-lg">{error || "No photos available."}</div>
        <a
          href="/admin/login"
          className="text-sm underline hover:opacity-80 transition-opacity"
        >
          Go to Admin Dashboard to add photos →
        </a>
      </div>
    );
  }

  const columnPhotos = [
    photos.filter((_, i) => i % 4 === 0),
    photos.filter((_, i) => i % 4 === 1),
    photos.filter((_, i) => i % 4 === 2),
    photos.filter((_, i) => i % 4 === 3),
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
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-screen">
            {columnPhotos.map((columnItems, columnIndex) => (
              <div
                key={columnIndex}
                className="column overflow-y-auto scrollbar-hide h-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
