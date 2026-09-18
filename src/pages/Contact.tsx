import { useState, useEffect } from 'react';
import { PortfolioHeader } from '@/components/PortfolioHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  author_name: string;
  email: string;
  phone: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  location_city: string;
  location_regions: string;
  work_types: string;
}

const defaultSettings: SiteSettings = {
  author_name: 'Avishek Das',
  email: 'avishek.create@gmail.com',
  phone: '+91 89108 06926',
  instagram_url: 'https://www.instagram.com/avishek__das/',
  facebook_url: 'https://www.facebook.com/avishek.das.3914',
  youtube_url: 'https://www.youtube.com/@ADasFOTOGRAFIE',
  location_city: 'Malbazar, Jalpaiguri, North Bengal',
  location_regions: 'West Bengal|Assam',
  work_types: 'Pre-wedding Videos|Documentary Films|Fashion Photography|Wildlife Photography|Nature & Birds',
};

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', work_type: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle();
      if (!error && data) {
        setSettings({
          author_name: data.author_name || defaultSettings.author_name,
          email: data.email || defaultSettings.email,
          phone: data.phone || defaultSettings.phone,
          instagram_url: data.instagram_url || defaultSettings.instagram_url,
          facebook_url: data.facebook_url || defaultSettings.facebook_url,
          youtube_url: data.youtube_url || defaultSettings.youtube_url,
          location_city: data.location_city || defaultSettings.location_city,
          location_regions: data.location_regions || defaultSettings.location_regions,
          work_types: (data as any).work_types || defaultSettings.work_types,
        });
      }
    };
    fetchSettings();
  }, []);

  const parseList = (str: string) => str.split('|').filter(Boolean);
  const workTypes = parseList(settings.work_types);
  const regions = parseList(settings.location_regions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: dbError } = await supabase.from('contact_messages').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
      work_type: form.work_type || null,
    }]);
    if (dbError) {
      setError('Something went wrong. Please try emailing me directly.');
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    setForm({ name: '', email: '', phone: '', message: '', work_type: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      <PortfolioHeader />

      <main className="container mx-auto px-6 pb-24 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-4">Get In Touch</h1>
          <div className="h-px w-16 bg-border mx-auto mb-6" />
          <p className="text-foreground/50 max-w-md mx-auto text-sm leading-relaxed">
            Whether you're looking for a {workTypes.slice(0,3).join(', ')} — I'd love to hear about your vision. Let's create something beautiful together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-medium tracking-wide mb-6">Contact Details</h2>
              <div className="space-y-5">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Email</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">{settings.email}</p>
                  </div>
                </a>

                <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Phone / WhatsApp</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">{settings.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Based In</p>
                    <p className="text-sm">{settings.location_city}</p>
                    <p className="text-xs text-foreground/40">Available across {regions.join(' & ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-lg font-medium tracking-wide mb-6">Follow My Work</h2>
              <div className="space-y-4">
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Instagram size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Instagram</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">{settings.instagram_url.replace('https://www.instagram.com/', '@').replace('/', '')}</p>
                  </div>
                </a>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Facebook size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Facebook</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">{settings.author_name}</p>
                  </div>
                </a>
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Youtube size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">YouTube</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">{settings.youtube_url.replace('https://www.youtube.com/', '')}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Available For */}
            <div className="border border-border rounded-xl p-6">
              <h3 className="font-medium text-sm tracking-wide mb-4">Available For</h3>
              <div className="flex flex-wrap gap-2">
                {workTypes.map(tag => (
                  <span key={tag} className="text-xs border border-border rounded-full px-3 py-1 text-foreground/60">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-medium tracking-wide mb-6">Send a Message</h2>
            {success ? (
              <div className="border border-border rounded-xl p-8 text-center">
                <p className="text-2xl mb-3">🎉</p>
                <h3 className="font-medium mb-2">Message Sent!</h3>
                <p className="text-foreground/50 text-sm">Thank you for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Your Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30" />
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30" />
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Phone / WhatsApp</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30" />
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Type of Work</label>
                  <select name="work_type" value={form.work_type} onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors text-foreground/70">
                    <option value="">Select work type...</option>
                    {workTypes.map(type => (
                      <option key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Your Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell me about your project, date, location..." rows={5}
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30 resize-none" />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-lg px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
