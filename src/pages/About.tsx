import { PortfolioHeader } from '@/components/PortfolioHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Camera, MapPin, Mail, Phone, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  author_name: string;
  about_text: string;
  phone: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  gear_list: string;
  specialties: string;
  work_types: string;
  location_city: string;
  location_regions: string;
  timeline: string;
  profile_photo_1: string;
}

const defaultSettings: SiteSettings = {
  author_name: 'Avishek Das',
  about_text: `Some people are born with a camera in their hands. I wasn't — but I found mine early enough. It started somewhere around 2004–05, with a Kodak reel camera that belonged to a family member. The weight of it, the click of the shutter, the mystery of waiting for the film to develop — something about that process never left me.\n\nFast forward to 2014 — a friend handed me his camera for a wedding shoot. I showed up, shot the whole day, and somewhere between the chaos of dancing relatives and golden-hour portraits, I realized this wasn't just a favour — it was a calling. From weddings, I wandered into documentary filmmaking, then into the wild silence of forests, where birds sing before the world wakes up and light bends through trees like it has somewhere important to be.\n\nToday, I shoot wildlife, nature, and birds with a Sony A7c — chasing moments that most people never slow down enough to see. Based in the lush green corridors of North Bengal, every frame I capture is a love letter to the wild.`,
  phone: '+91 89108 06926',
  email: 'avishek.create@gmail.com',
  instagram_url: 'https://www.instagram.com/avishek__das/',
  facebook_url: 'https://www.facebook.com/avishek.das.3914',
  youtube_url: 'https://www.youtube.com/@ADasFOTOGRAFIE',
  gear_list: 'Sony A7c (Full Frame)|Telephoto lens for wildlife|Gimbal for video',
  specialties: 'Wildlife Photography|Nature Photography|Bird Photography|Pre-wedding Videos|Documentary Films|Fashion Photography',
  work_types: 'Pre-wedding Videos|Documentary Films|Fashion Photography|Wildlife Photography|Nature & Birds',
  location_city: 'Malbazar, Jalpaiguri',
  location_regions: 'North Bengal|Siliguri & Kolkata|Assam & Northeast',
  timeline: '2004-2005|The Reel Camera|First touched a Kodak reel camera from a family member. Fell in love with the magic of film before ever understanding what a shutter speed was.||2014|The Wedding That Changed Everything|Borrowed a friend\'s camera for a wedding shoot. That single day ignited a professional journey into wedding photography and documentary filmmaking.||2014-Present|Multimedia & Design|Studied Multimedia while working professionally — passion and profession running side by side, each feeding the other.||Now|Into the Wild|Sony A7c in hand, exploring the forests and wetlands of North Bengal — documenting birds, wildlife, and the quiet beauty that exists beyond the noise of everyday life.',
  profile_photo_1: '/profile-photo.jpg',
};

const About = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle();
      if (!error && data) {
        setSettings({
          author_name: data.author_name || defaultSettings.author_name,
          about_text: data.about_text || defaultSettings.about_text,
          phone: data.phone || defaultSettings.phone,
          email: data.email || defaultSettings.email,
          instagram_url: data.instagram_url || defaultSettings.instagram_url,
          facebook_url: data.facebook_url || defaultSettings.facebook_url,
          youtube_url: data.youtube_url || defaultSettings.youtube_url,
          gear_list: data.gear_list || defaultSettings.gear_list,
          specialties: data.specialties || defaultSettings.specialties,
          work_types: data.work_types || defaultSettings.work_types,
          location_city: data.location_city || defaultSettings.location_city,
          location_regions: data.location_regions || defaultSettings.location_regions,
          timeline: data.timeline || defaultSettings.timeline,
          profile_photo_1: data.profile_photo_1 || defaultSettings.profile_photo_1,
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  // Parse pipe-separated values
  const parseList = (str: string) => str.split('|').filter(Boolean);

  // Parse timeline: each event separated by ||, fields by |
  const parseTimeline = (str: string) => {
    return str.split('||').map(event => {
      const parts = event.split('|');
      return { year: parts[0] || '', title: parts[1] || '', desc: parts[2] || '' };
    });
  };

  const gear = parseList(settings.gear_list);
  const specialties = parseList(settings.specialties);
  const workTypes = parseList(settings.work_types);
  const regions = parseList(settings.location_regions);
  const timeline = parseTimeline(settings.timeline);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      <PortfolioHeader />

      <main className="container mx-auto px-6 pb-24 max-w-5xl">

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={settings.profile_photo_1} alt={settings.author_name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-foreground/60" />
              <span>{settings.location_city}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm tracking-widest text-foreground/50 uppercase mb-2">Photographer & Filmmaker</p>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">{settings.author_name}</h1>
              <div className="h-px w-16 bg-border mb-6" />
            </div>
            {settings.about_text.split('\n\n').map((para, i) => (
              <p key={i} className="text-foreground/70 leading-relaxed text-base">{para}</p>
            ))}
          </div>
        </div>

        {/* Gear, Specialties, Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="border border-border rounded-xl p-6">
            <Camera size={24} className="mb-4 text-foreground/50" />
            <h3 className="font-semibold tracking-wide mb-3">My Gear</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              {gear.map((item, i) => <li key={i}>📷 {item}</li>)}
            </ul>
          </div>

          <div className="border border-border rounded-xl p-6">
            <span className="text-2xl mb-4 block">🌿</span>
            <h3 className="font-semibold tracking-wide mb-3">Specialties</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              {specialties.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>

          <div className="border border-border rounded-xl p-6">
            <MapPin size={24} className="mb-4 text-foreground/50" />
            <h3 className="font-semibold tracking-wide mb-3">Based In</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              <li>📍 {settings.location_city}</li>
              {regions.map((r, i) => <li key={i}>🌏 {r}</li>)}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-2xl font-light tracking-widest text-center mb-12 uppercase">The Journey</h2>
          <div className="relative border-l border-border ml-4 pl-8 space-y-10">
            {timeline.map((event, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-foreground/20 border border-border" />
                <p className="text-xs text-foreground/40 mb-1">{event.year}</p>
                <h4 className="font-medium mb-1">{event.title}</h4>
                <p className="text-foreground/60 text-sm">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div className="text-center border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-light tracking-widest uppercase mb-2">Let's Connect</h2>
          <p className="text-foreground/50 text-sm mb-4">Available for {workTypes.join(', ')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Mail size={16} /> {settings.email}
            </a>
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Phone size={16} /> {settings.phone}
            </a>
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Instagram size={16} /> @avishek__das
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
