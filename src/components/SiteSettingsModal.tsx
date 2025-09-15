import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SiteSettings, SiteSettingsFormData } from '@/types/siteSettings';
import { validateImage } from '@/utils/imageValidation';
import { Loader2, X, Upload } from 'lucide-react';

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
  const [profileFiles, setProfileFiles] = useState<{ [key: string]: File | null }>({
    profile_photo_1: null,
    profile_photo_2: null,
    profile_photo_3: null,
  });
  const [profilePreviews, setProfilePreviews] = useState<{ [key: string]: string }>({
    profile_photo_1: '',
    profile_photo_2: '',
    profile_photo_3: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        author_name: settings.author_name,
        about_text: settings.about_text,
        phone: settings.phone || '',
        email: settings.email || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || '',
      });
      setProfilePreviews({
        profile_photo_1: settings.profile_photo_1 || '',
        profile_photo_2: settings.profile_photo_2 || '',
        profile_photo_3: settings.profile_photo_3 || '',
      });
    } else {
      setFormData({
        author_name: '',
        about_text: '',
        phone: '',
        email: '',
        facebook_url: '',
        instagram_url: '',
        youtube_url: '',
      });
      setProfilePreviews({
        profile_photo_1: '',
        profile_photo_2: '',
        profile_photo_3: '',
      });
    }
    setProfileFiles({
      profile_photo_1: null,
      profile_photo_2: null,
      profile_photo_3: null,
    });
    setErrors({});
  }, [settings, isOpen]);

  const handleFileChange = async (photoKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImage(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, [photoKey]: validation.error! }));
      return;
    }

    setErrors(prev => ({ ...prev, [photoKey]: '' }));
    setProfileFiles(prev => ({ ...prev, [photoKey]: file }));
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setProfilePreviews(prev => ({ ...prev, [photoKey]: url }));
  };

  const removePhoto = (photoKey: string) => {
    setProfileFiles(prev => ({ ...prev, [photoKey]: null }));
    setProfilePreviews(prev => ({ ...prev, [photoKey]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.author_name.trim()) {
      newErrors.author_name = 'Author name is required';
    }

    if (!formData.about_text.trim()) {
      newErrors.about_text = 'About text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData: SiteSettingsFormData = {
        ...formData,
        profile_photo_1: profileFiles.profile_photo_1 || undefined,
        profile_photo_2: profileFiles.profile_photo_2 || undefined,
        profile_photo_3: profileFiles.profile_photo_3 || undefined,
      };
      
      await onSave(submitData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save site settings",
        variant: "destructive",
      });
    }
  };

  const ProfilePhotoUpload = ({ photoKey, label }: { photoKey: string; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {profilePreviews[photoKey] && (
        <div className="relative inline-block">
          <img
            src={profilePreviews[photoKey]}
            alt={`${label} preview`}
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={() => removePhoto(photoKey)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={`${photoKey}-upload`}
          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-2 pb-3">
            <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Click to upload
            </p>
          </div>
          <input
            id={`${photoKey}-upload`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(photoKey, e)}
          />
        </label>
      </div>
      {errors[photoKey] && <p className="text-sm text-destructive">{errors[photoKey]}</p>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Page Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Author Name</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Your Name"
                  className={errors.author_name ? 'border-destructive' : ''}
                />
                {errors.author_name && <p className="text-sm text-destructive">{errors.author_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_text">About Text</Label>
                <Textarea
                  id="about_text"
                  value={formData.about_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, about_text: e.target.value }))}
                  placeholder="Tell visitors about yourself..."
                  rows={4}
                  className={errors.about_text ? 'border-destructive' : ''}
                />
                {errors.about_text && <p className="text-sm text-destructive">{errors.about_text}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4">Profile Photos (up to 3)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProfilePhotoUpload photoKey="profile_photo_1" label="Profile Photo 1" />
              <ProfilePhotoUpload photoKey="profile_photo_2" label="Profile Photo 2" />
              <ProfilePhotoUpload photoKey="profile_photo_3" label="Profile Photo 3" />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteSettingsModal;