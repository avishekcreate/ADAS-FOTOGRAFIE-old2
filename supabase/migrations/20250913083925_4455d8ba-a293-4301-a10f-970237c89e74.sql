-- Create photos table for image management
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a photo gallery)
CREATE POLICY "Photos are viewable by everyone" 
ON public.photos 
FOR SELECT 
USING (true);

CREATE POLICY "Photos can be inserted by anyone" 
ON public.photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Photos can be updated by anyone" 
ON public.photos 
FOR UPDATE 
USING (true);

CREATE POLICY "Photos can be deleted by anyone" 
ON public.photos 
FOR DELETE 
USING (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- Create storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anyone can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();