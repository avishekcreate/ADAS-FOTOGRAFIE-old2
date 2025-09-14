import { PortfolioHeader } from '@/components/PortfolioHeader';
import { InfiniteScrollGallery } from '@/components/InfiniteScrollGallery';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
      </div>
      
      {/* Header section */}
      <PortfolioHeader />
      
      {/* Infinite scroll photo gallery */}
      <InfiniteScrollGallery 
        autoplay={true}
        autoplaySpeed={1}
        pauseOnHover={true}
      />
    </div>
  );
};

export default Index;
