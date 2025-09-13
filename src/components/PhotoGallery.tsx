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
    title: "Soulfe",
    description: "A portr through dramatic lighting and intimate composition.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 2,
    image: landscape1,
    title: "Mistwn",
    description: "The serene beauty oon nature's quiet power.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 3,
    image: architecture1,
    title: "Urbtry",
    description: "Abstract archisign and natural light.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 4,
    image: street1,
    title: "Cies",
    description: "Candid moments from tion in public spaces.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 5,
    image: nature1,
    title: "Morw",
    description: "Macro photogra and textures.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 6,
    image: abstract1,
    title: "Etheow",
    description: "Abstract formsphy and visual poetry.",
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
    title: "Rollills",
    description: "Minimalist la and negative space.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 9,
    image: architecture2,
    title: "Concreams",
    description: "Brutalistul composition and lighting.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 10,
    image: street2,
    title: "Raintories",
    description: "Urban poetry caty in everyday scenes.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 11,
    image: nature2,
    title: "Water'dge",
    description: "Macro exploration of nat in morning dew.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 12,
    image: abstract2,
    title: "SmokDance",
    description: "Abstract photoe and light interaction.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 13,
    image: wildlife1,
    title: "Freeight",
    description: "Wildlife ph in their natural element.",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    id: 14,
    image: automotive1,
    title: "Clnes",
    description: "Automotive photography celebrating the timeless desin of vintage automobiles.",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    id: 15,
    image: portrait3,
    title: "Weathdom",
    description: "A portrait study in weathered hands.",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    id: 16,
    image: interior1,
    title: "Liow",
    description: "Architectural ay of natural light and space.",
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
