import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem, MediaFormData } from '@/types/media';
import { SiteSettings, SiteSettingsFormData } from '@/types/siteSettings';
import MediaItemModal from '@/components/MediaItemModal';
import SiteSettingsModal from '@/components/SiteSettingsModal';
import { generateThumbnailPath } from '@/utils/imageValidation';
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash2, LogOut, Loader2, Settings, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

// ✅ Updated to new Supabase project URL
const SUPABASE_STORAGE_URL = "https://fywfjhlugfyorteizurk.supabase.co/storage/v1/object/public/media";

const AdminDashboard = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaItems();
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    filterItems();
  }, [mediaItems, searchTerm, dateRange]);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setSiteSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const filterItems = () => {
    let filtered = [...mediaItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange?.from) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        const fromDate = new Date(dateRange.from!);
        const toDate = dateRange.to ? new Date(dateRange.to) : new Date();
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    setFilteredItems(filtered);
  };

  // ✅ Fixed: uses new Supabase project URL
  const uploadFile = async (file: File, path?: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = path || `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    
    return `${SUPABASE_STORAGE_URL}/${fileName}`;
  };

  const deleteFile = async (url: string) => {
    const fileName = url.split('/').pop();
    if (fileName) {
      await supabase.storage.from('media').remove([fileName]);
    }
  };

  const handleSaveMediaItem = async (formData: MediaFormData) => {
    setIsModalLoading(true);
    
    try {
      let imagePath = selectedItem?.image_path || '';
      
      if (formData.image) {
        if (selectedItem?.image_path) {
          await deleteFile(selectedItem.image_path);
        }
        imagePath = await uploadFile(formData.image);
      }

      const itemData = {
        title: formData.title,
        description: formData.description,
        image_path: imagePath,
        thumbnail_path: generateThumbnailPath(imagePath),
      };

      if (selectedItem) {
        const { error } = await supabase
          .from('media_items')
          .update(itemData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        
        toast({ title: "Success", description: "Media item updated successfully" });
      } else {
        const { error } = await supabase
          .from('media_items')
          .insert([itemData]);

        if (error) throw error;
        
        toast({ title: "Success", description: "Media item created successfully" });
      }

      fetchMediaItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save media item",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteMediaItem = async (item: MediaItem) => {
    try {
      await deleteFile(item.image_path);

      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({ title: "Success", description: "Media item deleted successfully" });
      fetchMediaItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media item",
        variant: "destructive",
      });
    }
  };

  const handleSaveSiteSettings = async (formData: SiteSettingsFormData) => {
    setIsSettingsLoading(true);
    
    try {
      let profilePhoto1 = siteSettings?.profile_photo_1 || '';
      let profilePhoto2 = siteSettings?.profile_photo_2 || '';
      let profilePhoto3 = siteSettings?.profile_photo_3 || '';

      if (formData.profile_photo_1) {
        if (profilePhoto1) await deleteFile(profilePhoto1);
        profilePhoto1 = await uploadFile(formData.profile_photo_1, `profile_1_${Date.now()}.${formData.profile_photo_1.name.split('.').pop()}`);
      }
      if (formData.profile_photo_2) {
        if (profilePhoto2) await deleteFile(profilePhoto2);
        profilePhoto2 = await uploadFile(formData.profile_photo_2, `profile_2_${Date.now()}.${formData.profile_photo_2.name.split('.').pop()}`);
      }
      if (formData.profile_photo_3) {
        if (profilePhoto3) await deleteFile(profilePhoto3);
        profilePhoto3 = await uploadFile(formData.profile_photo_3, `profile_3_${Date.now()}.${formData.profile_photo_3.name.split('.').pop()}`);
      }

      const settingsData = {
        author_name: formData.author_name,
        about_text: formData.about_text,
        phone: formData.phone || null,
        email: formData.email || null,
        facebook_url: formData.facebook_url || null,
        instagram_url: formData.instagram_url || null,
        youtube_url: formData.youtube_url || null,
        profile_photo_1: profilePhoto1 || null,
        profile_photo_2: profilePhoto2 || null,
        profile_photo_3: profilePhoto3 || null,
      };

      if (siteSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update(settingsData)
          .eq('id', siteSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([settingsData]);
        if (error) throw error;
      }

      toast({ title: "Success", description: "Site settings saved successfully" });
      fetchSiteSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save site settings",
        variant: "destructive",
      });
    } finally {
      setIsSettingsLoading(false);
      setIsSettingsModalOpen(false);
    }
  };

  const openAddModal = () => { setSelectedItem(null); setIsModalOpen(true); };
  const openEditModal = (item: MediaItem) => { setSelectedItem(item); setIsModalOpen(true); };
  const openSettingsModal = () => { setIsSettingsModalOpen(true); };
  const handleLogout = async () => { await signOut(); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Manage Photos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Media Items</CardTitle>
                  <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Media Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full md:w-[240px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : format(dateRange.from, "LLL dd, y")
                        ) : ("Pick a date range")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creation Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No media items found. Click "Add Media Item" to upload your first photo!
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{format(new Date(item.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <img src={item.thumbnail_path || item.image_path} alt={item.title} className="w-16 h-16 object-cover rounded" />
                            </TableCell>
                            <TableCell className="font-mono text-sm">{item.id.slice(0, 8)}...</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Media Item</AlertDialogTitle>
                                      <AlertDialogDescription>Are you sure you want to delete "{item.title}"? This cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteMediaItem(item)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Site Settings</CardTitle>
                  <Button onClick={openSettingsModal}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {siteSettings ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Author Information</h3>
                      <p><span className="font-medium">Name:</span> {siteSettings.author_name}</p>
                      <p><span className="font-medium">Email:</span> {siteSettings.email || 'Not set'}</p>
                      <p><span className="font-medium">Phone:</span> {siteSettings.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About Text</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{siteSettings.about_text}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Social Links</h3>
                      <p><span className="font-medium">Facebook:</span> {siteSettings.facebook_url || 'Not set'}</p>
                      <p><span className="font-medium">Instagram:</span> {siteSettings.instagram_url || 'Not set'}</p>
                      <p><span className="font-medium">YouTube:</span> {siteSettings.youtube_url || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Profile Photos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[siteSettings.profile_photo_1, siteSettings.profile_photo_2, siteSettings.profile_photo_3].map((photo, index) => (
                          <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                            {photo ? (
                              <img src={photo} alt={`Profile ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No photo</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No site settings configured yet. Click "Edit Settings" to add your info.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MediaItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMediaItem}
        item={selectedItem}
        isLoading={isModalLoading}
      />

      <SiteSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSiteSettings}
        settings={siteSettings}
        isLoading={isSettingsLoading}
      />
    </div>
  );
};

export default AdminDashboard;
