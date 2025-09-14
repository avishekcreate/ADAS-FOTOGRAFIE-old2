import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem, MediaFormData } from '@/types/media';
import MediaItemModal from '@/components/MediaItemModal';
import { generateThumbnailPath } from '@/utils/imageValidation';
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash2, LogOut, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

const AdminDashboard = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaItems();
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

  const filterItems = () => {
    let filtered = [...mediaItems];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
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

  const handleSaveMediaItem = async (formData: MediaFormData) => {
    setIsModalLoading(true);
    
    try {
      let imagePath = selectedItem?.image_path || '';
      
      // Upload new image if provided
      if (formData.image) {
        // Delete old image if updating
        if (selectedItem?.image_path) {
          const oldPath = selectedItem.image_path.split('/').pop();
          if (oldPath) {
            await supabase.storage.from('media').remove([oldPath]);
          }
        }

        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;
        
        imagePath = `https://hxuixlxosphjfznbocui.supabase.co/storage/v1/object/public/media/${fileName}`;
      }

      const itemData = {
        title: formData.title,
        description: formData.description,
        image_path: imagePath,
        thumbnail_path: generateThumbnailPath(imagePath),
      };

      if (selectedItem) {
        // Update existing item
        const { error } = await supabase
          .from('media_items')
          .update(itemData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Media item updated successfully",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('media_items')
          .insert([itemData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Media item created successfully",
        });
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
    }
  };

  const handleDeleteMediaItem = async (item: MediaItem) => {
    try {
      // Delete file from storage
      const fileName = item.image_path.split('/').pop();
      if (fileName) {
        await supabase.storage.from('media').remove([fileName]);
      }

      // Delete record from database
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Media item deleted successfully",
      });

      fetchMediaItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media item",
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Media Management</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Media Items ({filteredItems.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Filter by date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <Button onClick={openAddModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Media Item
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creation Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(new Date(item.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <img
                          src={item.thumbnail_path || item.image_path}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded"
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Media Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMediaItem(item)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No media items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <MediaItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMediaItem}
        item={selectedItem}
        isLoading={isModalLoading}
      />
    </div>
  );
};

export default AdminDashboard;