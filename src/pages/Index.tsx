import { PortfolioHeader } from '@/components/PortfolioHeader';
import { InfiniteScrollGallery } from '@/components/InfiniteScrollGallery';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Theme toggle */}
      <ThemeToggle />
      
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
