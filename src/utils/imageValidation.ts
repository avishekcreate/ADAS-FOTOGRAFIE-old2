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

    // No resolution validation - accept any resolution
    resolve({ valid: true });
  });
};

export const generateThumbnailPath = (imagePath: string): string => {
  // Use Supabase image transformations for thumbnails
  const baseUrl = 'https://hxuixlxosphjfznbocui.supabase.co/storage/v1/object/public/media/';
  const filename = imagePath.replace(baseUrl, '');
  return `${baseUrl}${filename}?width=480&height=270&resize=cover&quality=80`;
};