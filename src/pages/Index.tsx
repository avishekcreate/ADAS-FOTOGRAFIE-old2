import { useState, useEffect } from 'react';
import { PortfolioHeader } from '@/components/PortfolioHeader';
import { InfiniteScrollGallery } from '@/components/InfiniteScrollGallery';
import { MasonryGallery } from '@/components/MasonryGallery';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  // Detect if user is on mobile
  const isMobile = () => window.innerWidth < 768;

  // Default: always OFF on mobile, OFF on desktop too (user can toggle)
  const [infiniteScrollOn, setInfiniteScrollOn] = useState(false);
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
      if (isMobile()) setInfiniteScrollOn(false); // force off on mobile
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top right — theme toggle only */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Bottom right — infinite scroll toggle, desktop only */}
      {!mobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setInfiniteScrollOn(!infiniteScrollOn)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border shadow-lg transition-all duration-300 ${
              infiniteScrollOn
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background/90 text-foreground/60 border-border hover:border-foreground/40'
            }`}
            title="Toggle infinite scroll gallery"
          >
            <span className={`w-2 h-2 rounded-full transition-colors ${infiniteScrollOn ? 'bg-background' : 'bg-foreground/30'}`} />
            Infinite scroll
          </button>
        </div>
      )}

      {/* Header */}
      <PortfolioHeader />

      {/* Gallery — shows infinite scroll or normal grid depending on toggle */}
      {!mobile && infiniteScrollOn ? (
        <InfiniteScrollGallery
          autoplay={true}
          autoplaySpeed={1}
          pauseOnHover={true}
        />
      ) : (
        <MasonryGallery />
      )}
    </div>
  );
};

export default Index;
