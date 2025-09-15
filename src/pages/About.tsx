import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '@/types/siteSettings';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const profilePhotos = [
    settings?.profile_photo_1,
    settings?.profile_photo_2,
    settings?.profile_photo_3,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Minimal-Flux
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link to="/about" className="text-foreground font-medium">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* About Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Photos */}
          {profilePhotos.length > 0 && (
            <div className="mb-12">
              <div className={`grid gap-6 ${
                profilePhotos.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                profilePhotos.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                'grid-cols-1 md:grid-cols-3'
              }`}>
                {profilePhotos.map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={photo}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Content */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">
              {settings?.author_name || 'About Me'}
            </h1>
            
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {settings?.about_text || 'Welcome to our photography portfolio. We specialize in capturing beautiful moments and creating lasting memories.'}
              </p>
            </div>

            {/* Contact Info */}
            {(settings?.email || settings?.phone) && (
              <div className="pt-8 border-t">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-2">
                  {settings.email && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Email:</span> {settings.email}
                    </p>
                  )}
                  {settings.phone && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Phone:</span> {settings.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(settings?.facebook_url || settings?.instagram_url || settings?.youtube_url) && (
              <div className="pt-6">
                <div className="flex justify-center space-x-6">
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings.youtube_url && (
                    <a
                      href={settings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;