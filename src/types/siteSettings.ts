export interface SiteSettings {
  id: string;
  author_name: string;
  about_text: string;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  profile_photo_1?: string;
  profile_photo_2?: string;
  profile_photo_3?: string;
  gear_list?: string;
  specialties?: string;
  work_types?: string;
  location_city?: string;
  location_regions?: string;
  timeline?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsFormData {
  author_name: string;
  about_text: string;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  profile_photo_1?: File;
  profile_photo_2?: File;
  profile_photo_3?: File;
  gear_list?: string;
  specialties?: string;
  work_types?: string;
  location_city?: string;
  location_regions?: string;
  timeline?: string;
}
