-- Create site_settings table for managing page content
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL DEFAULT 'Author Name',
    about_text TEXT NOT NULL DEFAULT 'About text goes here...',
    phone TEXT,
    email TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    profile_photo_1 TEXT,
    profile_photo_2 TEXT,
    profile_photo_3 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated admin users only
CREATE POLICY "Only authenticated users can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings record (singleton pattern)
INSERT INTO public.site_settings (author_name, about_text, email) 
VALUES ('Photographer Name', 'Welcome to my photography portfolio. I specialize in capturing beautiful moments and creating lasting memories.', 'contact@example.com');