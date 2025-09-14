export const validateImage = (file: File): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      resolve({ valid: false, error: 'File size must be less than 50MB' });
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      resolve({ valid: false, error: 'File must be an image' });
      return;
    }

    // Check image resolution
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < 1920 || img.height < 1080) {
        resolve({ 
          valid: false, 
          error: 'Image resolution must be at least 1920×1080 pixels' 
        });
      } else {
        resolve({ valid: true });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Invalid image file' });
    };
    
    img.src = url;
  });
};

export const generateThumbnailPath = (imagePath: string): string => {
  // Use Supabase image transformations for thumbnails
  const baseUrl = 'https://hxuixlxosphjfznbocui.supabase.co/storage/v1/object/public/media/';
  const filename = imagePath.replace(baseUrl, '');
  return `${baseUrl}${filename}?width=480&height=270&resize=cover&quality=80`;
};