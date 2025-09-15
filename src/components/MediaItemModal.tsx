import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MediaItem, MediaFormData } from '@/types/media';
import { validateImage } from '@/utils/imageValidation';
import { Loader2, X, Upload } from 'lucide-react';

interface MediaItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MediaFormData) => Promise<void>;
  item?: MediaItem | null;
  isLoading: boolean;
}

const MediaItemModal = ({ isOpen, onClose, onSave, item, isLoading }: MediaItemModalProps) => {
  const [formData, setFormData] = useState<MediaFormData>({
    title: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
      });
      setPreviewUrl(item.image_path);
    } else {
      setFormData({ title: '', description: '' });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setErrors({});
  }, [item, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImage(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, image: validation.error! }));
      return;
    }

    setErrors(prev => ({ ...prev, image: '' }));
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (item) {
      setPreviewUrl('');
    } else {
      setPreviewUrl('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Image validation
    if (!item && !selectedFile) {
      newErrors.image = 'Image is required for new items';
    } else if (item && !previewUrl && !selectedFile) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSave({
        ...formData,
        image: selectedFile || undefined,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save media item",
        variant: "destructive",
      });
    }
  };

  const isFormValid = !errors.title && !errors.description && !errors.image && 
                     formData.title.trim() && formData.description.trim() &&
                     (item ? (previewUrl || selectedFile) : selectedFile);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Update Media Item' : 'Add Media Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            {previewUrl && (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP (max 50MB, any resolution)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {item ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                item ? 'Update' : 'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaItemModal;