import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SiteSettings, SiteSettingsFormData } from '@/types/siteSettings';
import { Loader2 } from 'lucide-react';

interface SiteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SiteSettingsFormData) => Promise<void>;
  settings?: SiteSettings | null;
  isLoading: boolean;
}

const SiteSettingsModal = ({ isOpen, onClose, onSave, settings, isLoading }: SiteSettingsModalProps) => {
  const [formData, setFormData] = useState<SiteSettingsFormData>({
    author_name: '',
    about_text: '',
    phone: '',
    email: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
  });

  const [extraData, setExtraData] = useState({
    gear_list: '',
    specialties: '',
    work_types: '',
    location_city: '',
    location_regions: '',
    timeline: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        author_name: settings.author_name || '',
        about_text: settings.about_text || '',
        phone: settings.phone || '',
        email: settings.email || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || '',
      });
      setExtraData({
        gear_list: (settings as any).gear_list || 'Sony A7c (Full Frame)|Telephoto lens for wildlife|Gimbal for video',
        specialties: (settings as any).specialties || 'Wildlife Photography|Nature Photography|Bird Photography',
        work_types: (settings as any).work_types || 'Pre-wedding Videos|Documentary Films|Fashion Photography',
        location_city: (settings as any).location_city || 'Malbazar, Jalpaiguri',
        location_regions: (settings as any).location_regions || 'North Bengal|Siliguri & Kolkata|Assam & Northeast',
        timeline: (settings as any).timeline || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExtraData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.author_name) {
      toast({ title: "Error", description: "Author name is required", variant: "destructive" });
      return;
    }
    await onSave({ ...formData, ...extraData } as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Site Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Basic Info</h3>
            <div>
              <Label>Your Name *</Label>
              <Input name="author_name" value={formData.author_name} onChange={handleChange} placeholder="Avishek Das" />
            </div>
            <div>
              <Label>About / Story Text</Label>
              <Textarea name="about_text" value={formData.about_text} onChange={handleChange} placeholder="Your photography story..." rows={5} />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Contact Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email</Label>
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div>
                <Label>Phone / WhatsApp</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Social Links</h3>
            <div>
              <Label>Instagram URL</Label>
              <Input name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/username" />
            </div>
            <div>
              <Label>Facebook URL</Label>
              <Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/username" />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input name="youtube_url" value={formData.youtube_url} onChange={handleChange} placeholder="https://youtube.com/@channel" />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Location</h3>
            <div>
              <Label>City / Main Location</Label>
              <Input name="location_city" value={extraData.location_city} onChange={handleExtraChange} placeholder="Malbazar, Jalpaiguri" />
            </div>
            <div>
              <Label>Regions (separate with |)</Label>
              <Input name="location_regions" value={extraData.location_regions} onChange={handleExtraChange} placeholder="North Bengal|Siliguri & Kolkata|Assam" />
              <p className="text-xs text-muted-foreground mt-1">Example: North Bengal|Siliguri & Kolkata|Assam & Northeast</p>
            </div>
          </div>

          {/* Gear */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Camera Gear</h3>
            <div>
              <Label>Gear List (separate with |)</Label>
              <Input name="gear_list" value={extraData.gear_list} onChange={handleExtraChange} placeholder="Sony A7c|Telephoto lens|Gimbal" />
              <p className="text-xs text-muted-foreground mt-1">Example: Sony A7c (Full Frame)|Telephoto lens for wildlife|Gimbal for video</p>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Specialties</h3>
            <div>
              <Label>Specialties (separate with |)</Label>
              <Input name="specialties" value={extraData.specialties} onChange={handleExtraChange} placeholder="Wildlife Photography|Nature Photography|Bird Photography" />
              <p className="text-xs text-muted-foreground mt-1">These show as bullet points on your About page</p>
            </div>
          </div>

          {/* Work Types */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Available For (Work Types)</h3>
            <div>
              <Label>Work Types (separate with |)</Label>
              <Input name="work_types" value={extraData.work_types} onChange={handleExtraChange} placeholder="Pre-wedding Videos|Documentary Films|Fashion Photography" />
              <p className="text-xs text-muted-foreground mt-1">Shows as tags on your About and Contact pages</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Journey Timeline</h3>
            <div>
              <Label>Timeline Events</Label>
              <Textarea
                name="timeline"
                value={extraData.timeline}
                onChange={handleExtraChange}
                rows={6}
                placeholder="2004-2005|The Reel Camera|Your description here||2014|Wedding Photography|Another event"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: <strong>Year|Title|Description</strong> — separate events with <strong>||</strong><br/>
                Example: 2004|First Camera|Story here||2014|First Wedding|Story here
              </p>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SiteSettingsModal;
