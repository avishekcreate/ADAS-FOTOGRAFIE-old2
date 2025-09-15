import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/types/media';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
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
              <Link to="/portfolio" className="text-foreground font-medium">
                Portfolio
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of beautiful photography and creative work
          </p>
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No portfolio items available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {mediaItems.map((item, index) => (
              <Card key={item.id} className={`overflow-hidden ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <CardContent className="p-0">
                  <div className={`grid grid-cols-1 md:grid-cols-2 min-h-[400px] ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center space-y-4">
                      <h2 className="text-3xl font-bold text-foreground">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;