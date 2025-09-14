-- Update RLS policies to require authentication for all operations
DROP POLICY IF EXISTS "Photos are viewable by everyone" ON public.photos;
DROP POLICY IF EXISTS "Photos can be inserted by anyone" ON public.photos;
DROP POLICY IF EXISTS "Photos can be updated by anyone" ON public.photos;
DROP POLICY IF EXISTS "Photos can be deleted by anyone" ON public.photos;

-- Create new policies that require authentication
CREATE POLICY "Only authenticated users can view photos" 
ON public.photos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert photos" 
ON public.photos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update photos" 
ON public.photos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete photos" 
ON public.photos 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Update storage policies to require authentication
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON storage.objects;

CREATE POLICY "Only authenticated users can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery' AND auth.uid() IS NOT NULL);