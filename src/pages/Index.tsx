import { PortfolioHeader } from '@/components/PortfolioHeader';
import { InfiniteScrollGallery } from '@/components/InfiniteScrollGallery';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LiquidEtherBackground } from '@/components/LiquidEtherBackground';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Liquid Ether Background */}
      <LiquidEtherBackground />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Header section */}
        <div className="relative z-20">
          <PortfolioHeader />
        </div>
        
        {/* Infinite scroll photo gallery */}
        <InfiniteScrollGallery 
          autoplay={true}
          autoplaySpeed={1}
          pauseOnHover={true}
        />
      </div>
    </div>
  );
};

export default Index;
