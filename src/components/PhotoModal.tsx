import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  description: string;
}

export const PhotoModal = ({ isOpen, onClose, image, title, description }: PhotoModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-6xl max-h-[90vh] w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-overlay/80 hover:bg-overlay text-white rounded-full p-3 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="bg-surface rounded-lg overflow-hidden shadow-2xl">
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
          
          <div className="p-8">
            <h2 className="text-hero mb-4">{title}</h2>
            <p className="text-body max-w-2xl">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};