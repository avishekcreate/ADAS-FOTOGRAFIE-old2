import { useState, useMemo } from 'react';
import { PhotoCard } from './PhotoCard';
import { PhotoModal } from './PhotoModal';

// Import images
import portrait1 from '@/assets/portrait-1.jpg';
import portrait2 from '@/assets/portrait-2.jpg';
import portrait3 from '@/assets/portrait-3.jpg';
import landscape1 from '@/assets/landscape-1.jpg';
import landscape2 from '@/assets/landscape-2.jpg';
import architecture1 from '@/assets/architecture-1.jpg';
import architecture2 from '@/assets/architecture-2.jpg';
import street1 from '@/assets/street-1.jpg';
import street2 from '@/assets/street-2.jpg';
import nature1 from '@/assets/nature-1.jpg';
import nature2 from '@/assets/nature-2.jpg';
import abstract1 from '@/assets/abstract-1.jpg';
import abstract2 from '@/assets/abstract-2.jpg';
import wildlife1 from '@/assets/wildlife-1.jpg';
import automotive1 from '@/assets/automotive-1.jpg';
import interior1 from '@/assets/interior-1.jpg';

interface Photo {
  id: number;
  image: string;
  title: string;
  description: string;
  gridClass: string;
}

const photos: Photo[] = [
  {
    id: 1,
    image: portrait1,
    title: "Soulful Gaze",
    description: "A portrait that captures the depth of human emotion through dramatic lighting and intimate composition.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 2,
    image: landscape1,
    title: "Misty Dawn",
    description: "The serene beauty of mountain peaks emerging from morning mist, a meditation on nature's quiet power.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 3,
    image: architecture1,
    title: "Urban Geometry",
    description: "Abstract architectural forms that celebrate the intersection of human design and natural light.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 4,
    image: street1,
    title: "City Stories",
    description: "Candid moments from urban life, capturing the authentic spirit of human connection in public spaces.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 5,
    image: nature1,
    title: "Morning Dew",
    description: "Macro photography revealing the intricate beauty of nature's smallest details and textures.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 6,
    image: abstract1,
    title: "Ethereal Flow",
    description: "Abstract forms in motion, exploring the boundary between photography and visual poetry.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 7,
    image: portrait2,
    title: "Window Light",
    description: "Soft natural light creates a timeless portrait capturing authentic beauty and grace.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 8,
    image: landscape2,
    title: "Rolling Hills",
    description: "Minimalist landscape photography showcasing the power of simplicity and negative space.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 9,
    image: architecture2,
    title: "Concrete Dreams",
    description: "Brutalist architecture transformed into abstract art through careful composition and lighting.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 10,
    image: street2,
    title: "Rain Stories",
    description: "Urban poetry captured in a moment of weather, revealing the beauty in everyday scenes.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 11,
    image: nature2,
    title: "Water's Edge",
    description: "Macro exploration of nature's delicate patterns and the poetry found in morning dew.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 12,
    image: abstract2,
    title: "Smoke Dance",
    description: "Abstract photography exploring the ephemeral beauty of smoke and light interaction.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 13,
    image: wildlife1,
    title: "Freedom Flight",
    description: "Wildlife photography capturing the grace and power of birds in their natural element.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 14,
    image: automotive1,
    title: "Classic Lines",
    description: "Automotive photography celebrating the timeless design of vintage automobiles.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 15,
    image: portrait3,
    title: "Weathered Wisdom",
    description: "A portrait study exploring the beauty of age and the stories written in weathered hands.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 16,
    image: interior1,
    title: "Light & Shadow",
    description: "Architectural interior photography focusing on the interplay of natural light and space.",
    gridClass: "md:col-span-1 md:row-span-1"
  }
];

export const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Create columns for clean layout
  const photoColumns = useMemo(() => {
    const columns = [[], [], [], []] as Photo[][];
    photos.forEach((photo, index) => {
      columns[index % 4].push(photo);
    });
    return columns;
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {photoColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={`space-y-6 animate-vertical-float-${columnIndex + 1}`}>
                {column.map((photo) => (
                  <div key={photo.id}>
                    <PhotoCard
                      image={photo.image}
                      title={photo.title}
                      description={photo.description}
                      animationClass=""
                      onClick={() => handlePhotoClick(photo)}
                    />
                  </div>
                ))}
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