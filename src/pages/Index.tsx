import { PortfolioHeader } from '@/components/PortfolioHeader';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Header section */}
      <PortfolioHeader />
      
      {/* Photo gallery */}
      <PhotoGallery />
      
      {/* Footer */}
      <footer className="py-16 text-center border-t border-border-subtle">
        <div className="container mx-auto px-6">
          <p className="text-caption tracking-wider">
            © 2024 LENS & LIGHT PHOTOGRAPHY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
