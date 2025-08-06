import { useState, useMemo } from 'react';
import { PhotoCard } from './PhotoCard';
import { PhotoModal } from './PhotoModal';

// Import images
import portrait1 from '@/assets/portrait-1.jpg';
import landscape1 from '@/assets/landscape-1.jpg';
import architecture1 from '@/assets/architecture-1.jpg';
import street1 from '@/assets/street-1.jpg';
import nature1 from '@/assets/nature-1.jpg';
import abstract1 from '@/assets/abstract-1.jpg';

interface Photo {
  id: number;
  image: string;
  title: string;
  description: string;
  gridClass: string;
  animationClass: string;
}

const photos: Photo[] = [
  {
    id: 1,
    image: portrait1,
    title: "Soulful Gaze",
    description: "A portrait that captures the depth of human emotion through dramatic lighting and intimate composition.",
    gridClass: "md:col-span-1 md:row-span-2",
    animationClass: "photo-float"
  },
  {
    id: 2,
    image: landscape1,
    title: "Misty Dawn",
    description: "The serene beauty of mountain peaks emerging from morning mist, a meditation on nature's quiet power.",
    gridClass: "md:col-span-2 md:row-span-1",
    animationClass: "photo-float-delayed"
  },
  {
    id: 3,
    image: architecture1,
    title: "Urban Geometry",
    description: "Abstract architectural forms that celebrate the intersection of human design and natural light.",
    gridClass: "md:col-span-1 md:row-span-1",
    animationClass: "photo-float-slow"
  },
  {
    id: 4,
    image: street1,
    title: "City Stories",
    description: "Candid moments from urban life, capturing the authentic spirit of human connection in public spaces.",
    gridClass: "md:col-span-2 md:row-span-1",
    animationClass: "photo-float"
  },
  {
    id: 5,
    image: nature1,
    title: "Morning Dew",
    description: "Macro photography revealing the intricate beauty of nature's smallest details and textures.",
    gridClass: "md:col-span-1 md:row-span-1",
    animationClass: "photo-float-delayed"
  },
  {
    id: 6,
    image: abstract1,
    title: "Ethereal Flow",
    description: "Abstract forms in motion, exploring the boundary between photography and visual poetry.",
    gridClass: "md:col-span-1 md:row-span-2",
    animationClass: "photo-float-slow"
  }
];

export const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Shuffle photos for dynamic layout
  const shuffledPhotos = useMemo(() => {
    return [...photos].sort(() => Math.random() - 0.5);
  }, []);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleModalClose = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {shuffledPhotos.map((photo) => (
              <div key={photo.id} className={photo.gridClass}>
                <PhotoCard
                  image={photo.image}
                  title={photo.title}
                  description={photo.description}
                  animationClass={photo.animationClass}
                  onClick={() => handlePhotoClick(photo)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={handleModalClose}
        image={selectedPhoto?.image || ''}
        title={selectedPhoto?.title || ''}
        description={selectedPhoto?.description || ''}
      />
    </>
  );
};