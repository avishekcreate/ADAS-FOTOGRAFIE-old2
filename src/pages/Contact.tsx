import { useState } from 'react';
import { PortfolioHeader } from '@/components/PortfolioHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', work_type: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
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
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <PortfolioHeader />

      <main className="container mx-auto px-6 pb-24 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-4">Get In Touch</h1>
          <div className="h-px w-16 bg-border mx-auto mb-6" />
          <p className="text-foreground/50 max-w-md mx-auto text-sm leading-relaxed">
            Whether you're looking for a pre-wedding video, documentary film, or fashion shoot — 
            I'd love to hear about your vision. Let's create something beautiful together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-medium tracking-wide mb-6">Contact Details</h2>
              <div className="space-y-5">
                <a href="mailto:avishek.create@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Email</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">avishek.create@gmail.com</p>
                  </div>
                </a>

                <a href="tel:8910806926" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Phone / WhatsApp</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">+91 89108 06926</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Based In</p>
                    <p className="text-sm">Malbazar, Jalpaiguri, North Bengal</p>
                    <p className="text-xs text-foreground/40">Available across West Bengal & Assam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-lg font-medium tracking-wide mb-6">Follow My Work</h2>
              <div className="space-y-4">
                <a href="https://instagram.com/avishek__das" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Instagram size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Instagram</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">@avishek__das</p>
                  </div>
                </a>
                <a href="https://www.facebook.com/avishek.das.3914" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Facebook size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">Facebook</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">Avishek Das</p>
                  </div>
                </a>
                <a href="https://www.youtube.com/@ADasFOTOGRAFIE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                    <Youtube size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-0.5">YouTube</p>
                    <p className="text-sm group-hover:text-foreground transition-colors">@ADasFOTOGRAFIE</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Work types */}
            <div className="border border-border rounded-xl p-6">
              <h3 className="font-medium text-sm tracking-wide mb-4">Available For</h3>
              <div className="flex flex-wrap gap-2">
                {['Pre-wedding Videos', 'Documentary Films', 'Fashion Photography', 'Wildlife Photography', 'Nature & Birds'].map(tag => (
                  <span key={tag} className="text-xs border border-border rounded-full px-3 py-1 text-foreground/60">
                    {tag}
                  </span>
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
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Type of Work</label>
                  <select
                    name="work_type"
                    value={form.work_type}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors text-foreground/70"
                  >
                    <option value="">Select work type...</option>
                    <option value="prewedding">Pre-wedding Video</option>
                    <option value="documentary">Documentary Film</option>
                    <option value="fashion">Fashion Photography</option>
                    <option value="wildlife">Wildlife / Nature</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Your Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, date, location..."
                    rows={5}
                    className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-foreground/30 resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-lg px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                >
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
