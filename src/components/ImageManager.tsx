import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Edit2, Trash2, Eye } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export const ImageManager = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch photos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          title: title || file.name,
          description: description || null,
          image_url: publicUrl,
          file_name: fileName,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

      // Reset form and refetch photos
      setTitle('');
      setDescription('');
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const updatePhoto = async (photo: Photo) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({
          title: title,
          description: description || null
        })
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Photo updated successfully"
      });

      setEditingPhoto(null);
      setTitle('');
      setDescription('');
      fetchPhotos();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Error",
        description: "Failed to update photo",
        variant: "destructive"
      });
    }
  };

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([photo.file_name]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo deleted successfully"
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const startEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setTitle(photo.title);
    setDescription(photo.description || '');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading photos...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Image description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={uploading}>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Select Image'}
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{photo.title}</h3>
              {photo.description && (
                <p className="text-sm text-muted-foreground mb-4">{photo.description}</p>
              )}
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewingPhoto(photo)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{photo.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                      {photo.description && (
                        <p className="text-muted-foreground">{photo.description}</p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p>File: {photo.file_name}</p>
                        {photo.file_size && (
                          <p>Size: {(photo.file_size / 1024 / 1024).toFixed(2)} MB</p>
                        )}
                        <p>Uploaded: {new Date(photo.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit(photo)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deletePhoto(photo)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={() => editingPhoto && updatePhoto(editingPhoto)}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No photos uploaded yet. Upload your first image above!</p>
        </div>
      )}
    </div>
  );
};