-- Create media_items table
CREATE TABLE public.media_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_path TEXT NOT NULL,
    thumbnail_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated admin users only
CREATE POLICY "Only authenticated users can view media items" 
ON public.media_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert media items" 
ON public.media_items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update media items" 
ON public.media_items 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete media items" 
ON public.media_items 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create policies for media bucket
CREATE POLICY "Only authenticated users can view media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can upload media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update media files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete media files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_media_items_updated_at
BEFORE UPDATE ON public.media_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();