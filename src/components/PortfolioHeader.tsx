import { Instagram, Twitter, Linkedin } from 'lucide-react';
export const PortfolioHeader = () => {
  return <header className="relative z-10 pt-12 pb-20">
      <div className="container mx-auto px-6 flex flex-col gap-3">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-hero font-light tracking-widest">
            LENS & LIGHT
          </h1>
          <div className="h-px w-24 bg-border mx-auto mt-4"></div>
        </div>

        {/* Intro dialog boxes */}
        

        {/* Navigation Menu */}
        <nav>
          <ul className="flex justify-center space-x-12 text-body font-medium tracking-wider">
            <li>
              <a href="#" className="hover:text-text-primary transition-colors duration-300 relative group">
                PORTFOLIO
                <span className="absolute bottom-0 left-0 w-0 h-px bg-text-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-text-primary transition-colors duration-300 relative group">
                ABOUT
                <span className="absolute bottom-0 left-0 w-0 h-px bg-text-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-text-primary transition-colors duration-300 relative group">
                CONTACT
                <span className="absolute bottom-0 left-0 w-0 h-px bg-text-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-text-primary transition-colors duration-300 relative group">
                BLOG
                <span className="absolute bottom-0 left-0 w-0 h-px bg-text-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Social media icons */}
        <div className="flex justify-center space-x-8">
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </header>;
};