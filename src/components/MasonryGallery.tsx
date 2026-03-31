import { useEffect, useState } from "react";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  image: string;
  title: string;
  description: string;
}

export const MasonryGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_items')
        .select('id, title, description, image_path')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        setError("Failed to load photos.");
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setError("No photos found. Please add photos via the admin dashboard.");
        setLoading(false);
        return;
      }

      setPhotos(data.map((item) => ({
        id: item.id,
        image: item.image_path,
        title: item.title,
        description: item.description || "",
      })));
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-lg opacity-60">Loading gallery...</div>
      </div>
    );
  }

  if (error || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-60">
        <div className="text-lg">{error || "No photos available."}</div>
        <a href="/admin/login" className="text-sm underline hover:opacity-80 transition-opacity">
          Go to Admin Dashboard to add photos →
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pb-16">
        {/* Responsive masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid">
              <PhotoCard
                image={photo.image}
                title={photo.title}
                description={photo.description}
                onClick={() => setSelectedPhoto(photo)}
                animationClass=""
              />
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          isOpen={true}
          image={selectedPhoto.image}
          title={selectedPhoto.title}
          description={selectedPhoto.description}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
};
