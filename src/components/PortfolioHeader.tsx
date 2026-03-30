import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  author_name: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
}

const defaultSettings: SiteSettings = {
  author_name: "ADAS FOTOGRAFIE",
  instagram_url: "#",
  facebook_url: "#",
  youtube_url: "#",
};

export const PortfolioHeader = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('author_name, instagram_url, facebook_url, youtube_url')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      if (data) {
        setSettings({
          author_name: data.author_name || defaultSettings.author_name,
          instagram_url: data.instagram_url || defaultSettings.instagram_url,
          facebook_url: data.facebook_url || defaultSettings.facebook_url,
          youtube_url: data.youtube_url || defaultSettings.youtube_url,
        });
      }
    };

    fetchSettings();
  }, []);

  return (
    <header className="relative z-10 pt-12 pb-20">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 flex flex-col gap-3">

        {/* Logo / Site Name */}
        <div className="text-center">
          <h1 className="text-hero font-light tracking-widest">
            {settings.author_name}
          </h1>
          <div className="h-px w-24 bg-border mx-auto mt-4"></div>
        </div>

        {/* Navigation */}
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
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center space-x-8">
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors duration-300 transform hover:scale-110" aria-label="YouTube">
            <Youtube size={24} />
          </a>
        </div>

      </div>
    </header>
  );
};
