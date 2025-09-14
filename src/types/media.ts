export interface MediaItem {
  id: string;
  title: string;
  description: string;
  image_path: string;
  thumbnail_path?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaFormData {
  title: string;
  description: string;
  image?: File;
}