import { Instagram, Twitter, Linkedin } from 'lucide-react';

export const PortfolioHeader = () => {
  return (
    <header className="relative z-10 pt-12 pb-20">
      <div className="container mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1 className="text-hero font-light tracking-widest">
            LENS & LIGHT
          </h1>
          <div className="h-px w-24 bg-border mx-auto mt-4"></div>
        </div>

        {/* Intro dialog boxes */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="intro-dialog text-center">
            <h3 className="text-subtitle mb-4 font-medium">CREATIVE VISION</h3>
            <p className="text-body leading-relaxed">
              Capturing moments that speak to the soul through the art of light and shadow.
            </p>
          </div>
          
          <div className="intro-dialog text-center">
            <h3 className="text-subtitle mb-4 font-medium">ARTISTIC APPROACH</h3>
            <p className="text-body leading-relaxed">
              Every frame tells a story, blending technical precision with emotional depth.
            </p>
          </div>
          
          <div className="intro-dialog text-center">
            <h3 className="text-subtitle mb-4 font-medium">TIMELESS ELEGANCE</h3>
            <p className="text-body leading-relaxed">
              Creating images that transcend trends, focusing on enduring beauty and meaning.
            </p>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex justify-center space-x-8">
          <a 
            href="#" 
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a 
            href="#" 
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110"
            aria-label="Twitter"
          >
            <Twitter size={24} />
          </a>
          <a 
            href="#" 
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </header>
  );
};