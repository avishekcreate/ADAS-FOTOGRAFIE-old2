import { PortfolioHeader } from '@/components/PortfolioHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Camera, MapPin, Mail, Phone, Instagram } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <PortfolioHeader />

      <main className="container mx-auto px-6 pb-24 max-w-5xl">

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          {/* Profile Photo */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src="/profile-photo.jpg"
                alt="Avishek Das"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating location badge */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-foreground/60" />
              <span>Malbazar, Jalpaiguri</span>
            </div>
          </div>

          {/* Intro Text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm tracking-widest text-foreground/50 uppercase mb-2">Photographer & Filmmaker</p>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Avishek Das</h1>
              <div className="h-px w-16 bg-border mb-6" />
            </div>

            <p className="text-foreground/70 leading-relaxed text-base">
              Some people are born with a camera in their hands. I wasn't — but I found mine early enough. 
              It started somewhere around 2004–05, with a <strong>Kodak reel camera</strong> that belonged to a family 
              member. The weight of it, the click of the shutter, the mystery of waiting for the film to develop — 
              something about that process never left me.
            </p>

            <p className="text-foreground/70 leading-relaxed text-base">
              Fast forward to <strong>2014</strong> — a friend handed me his camera for a wedding shoot. 
              I showed up, shot the whole day, and somewhere between the chaos of dancing relatives and golden-hour portraits, 
              I realized this wasn't just a favour — it was a calling. From weddings, I wandered into 
              <strong> documentary filmmaking</strong>, then into the wild silence of forests, where birds 
              sing before the world wakes up and light bends through trees like it has somewhere important to be.
            </p>

            <p className="text-foreground/70 leading-relaxed text-base">
              Today, I shoot <strong>wildlife, nature, and birds</strong> with a Sony A7c — chasing moments 
              that most people never slow down enough to see. Based in the lush green corridors of 
              North Bengal, every frame I capture is a love letter to the wild.
            </p>
          </div>
        </div>

        {/* Gear & Style Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="border border-border rounded-xl p-6">
            <Camera size={24} className="mb-4 text-foreground/50" />
            <h3 className="font-semibold tracking-wide mb-3">My Gear</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              <li>📷 Sony A7c (Full Frame)</li>
              <li>🔭 Telephoto lens for wildlife</li>
              <li>🎬 Gimbal for video</li>
            </ul>
          </div>

          <div className="border border-border rounded-xl p-6">
            <span className="text-2xl mb-4 block">🌿</span>
            <h3 className="font-semibold tracking-wide mb-3">Specialties</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              <li>🦅 Wildlife Photography</li>
              <li>🌿 Nature Photography</li>
              <li>🐦 Bird Photography</li>
              <li>💍 Pre-wedding Videos</li>
              <li>🎥 Documentary Films</li>
              <li>👗 Fashion Photography</li>
            </ul>
          </div>

          <div className="border border-border rounded-xl p-6">
            <MapPin size={24} className="mb-4 text-foreground/50" />
            <h3 className="font-semibold tracking-wide mb-3">Based In</h3>
            <ul className="text-foreground/60 text-sm space-y-2">
              <li>📍 Malbazar, Jalpaiguri</li>
              <li>🌏 North Bengal</li>
              <li>🚂 Siliguri & Kolkata</li>
              <li>🌄 Assam & Northeast</li>
            </ul>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-20">
          <h2 className="text-2xl font-light tracking-widest text-center mb-12 uppercase">The Journey</h2>
          <div className="relative border-l border-border ml-4 pl-8 space-y-10">
            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-foreground/20 border border-border" />
              <p className="text-xs text-foreground/40 mb-1">2004 – 2005</p>
              <h4 className="font-medium mb-1">The Reel Camera</h4>
              <p className="text-foreground/60 text-sm">First touched a Kodak reel camera from a family member. Fell in love with the magic of film before ever understanding what a shutter speed was.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-foreground/20 border border-border" />
              <p className="text-xs text-foreground/40 mb-1">2014</p>
              <h4 className="font-medium mb-1">The Wedding That Changed Everything</h4>
              <p className="text-foreground/60 text-sm">Borrowed a friend's camera for a wedding shoot. That single day ignited a professional journey into wedding photography and documentary filmmaking.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-foreground/20 border border-border" />
              <p className="text-xs text-foreground/40 mb-1">2014 – Present</p>
              <h4 className="font-medium mb-1">Multimedia & Design</h4>
              <p className="text-foreground/60 text-sm">Studied Multimedia while working professionally — passion and profession running side by side, each feeding the other.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-foreground bg-opacity-80 border border-border" />
              <p className="text-xs text-foreground/40 mb-1">Now</p>
              <h4 className="font-medium mb-1">Into the Wild</h4>
              <p className="text-foreground/60 text-sm">Sony A7c in hand, exploring the forests and wetlands of North Bengal — documenting birds, wildlife, and the quiet beauty that exists beyond the noise of everyday life.</p>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-light tracking-widest uppercase mb-2">Let's Connect</h2>
          <p className="text-foreground/50 text-sm mb-8">Available for pre-wedding videos, documentary films & fashion photography</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:avishek.create@gmail.com" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Mail size={16} /> avishek.create@gmail.com
            </a>
            <a href="tel:8910806926" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Phone size={16} /> +91 89108 06926
            </a>
            <a href="https://instagram.com/avishek__das" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              <Instagram size={16} /> @avishek__das
            </a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default About;
