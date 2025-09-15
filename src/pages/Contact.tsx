import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
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
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground font-medium">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contact Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Get in touch with {settings?.author_name || 'us'} for inquiries and collaborations
          </p>

          <div className="grid gap-6">
            {/* Contact Information */}
            {(settings?.email || settings?.phone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.email && (
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <a 
                        href={`mailto:${settings.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  )}
                  {settings.phone && (
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <a 
                        href={`tel:${settings.phone}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Media */}
            {(settings?.facebook_url || settings?.instagram_url || settings?.youtube_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-6">
                    {settings.facebook_url && (
                      <a
                        href={settings.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {settings.instagram_url && (
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {settings.youtube_url && (
                      <a
                        href={settings.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Default contact message if no contact info is available */}
            {!settings?.email && !settings?.phone && !settings?.facebook_url && !settings?.instagram_url && !settings?.youtube_url && (
              <Card>
                <CardContent className="py-12">
                  <p className="text-muted-foreground">
                    Contact information will be displayed here once configured by the admin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;