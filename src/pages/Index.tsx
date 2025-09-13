import { PortfolioHeader } from '@/components/PortfolioHeader';
import { InfiniteScrollGallery } from '@/components/InfiniteScrollGallery';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ImageManager } from '@/components/ImageManager';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Camera, Database } from 'lucide-react';

const Index = () => {
  const [showManager, setShowManager] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManager(!showManager)}
          className="bg-surface-secondary/80 backdrop-blur-sm border-border hover:bg-surface-secondary"
        >
          {showManager ? <Camera className="w-4 h-4 mr-2" /> : <Database className="w-4 h-4 mr-2" />}
          {showManager ? 'Gallery View' : 'Manage Images'}
        </Button>
        <ThemeToggle />
      </div>
      
      {showManager ? (
        <ImageManager />
      ) : (
        <>
          {/* Header section */}
          <PortfolioHeader />
          
          {/* Infinite scroll photo gallery */}
          <InfiniteScrollGallery 
            autoplay={true}
            autoplaySpeed={1}
            pauseOnHover={true}
          />
        </>
      )}
    </div>
  );
};

export default Index;
