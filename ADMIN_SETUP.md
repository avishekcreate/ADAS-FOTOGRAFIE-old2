# Admin Media Management System Setup

## Overview
This system provides a secure admin interface for managing media items using Supabase authentication, storage, and database.

## System Architecture
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Storage)
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage with image transformations for thumbnails

## Database Schema
- **Table**: `media_items`
  - `id` (UUID, primary key)
  - `title` (text, required)
  - `description` (text, required)
  - `image_path` (text, required) - Full URL to the image in Supabase Storage
  - `thumbnail_path` (text, optional) - Thumbnail URL with transformations
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **Storage Bucket**: `media` (public bucket for serving images)

## Setting Up the Admin User

### Method 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Fill in the details:
   - **Email**: `avishek789@admin.com` (or any email you prefer)
   - **Password**: `terw@De!1`
   - **Email Confirm**: ✅ (enabled)
5. Click "Create user"

### Method 2: Using SQL (Alternative)
You can also create the user directly using SQL in the Supabase SQL Editor:

```sql
-- Insert admin user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'avishek789@admin.com',
  crypt('terw@De!1', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"iss":"supabase","ref":"' || (SELECT project_ref FROM supabase.secrets WHERE name = 'SUPABASE_PROJECT_REF') || '","role":"authenticated"}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Admin Access

### Login Credentials
- **URL**: `https://yourapp.com/admin/login`
- **Username**: `avishek789@admin.com` (or the email you used)
- **Password**: `terw@De!1`

### Admin Dashboard Features
1. **Media Table**: View all media items with creation date, title, thumbnail, and ID
2. **Search**: Search by title or ID
3. **Date Filter**: Filter items by creation date range
4. **Add Media**: Upload new media items with validation
5. **Edit Media**: Update existing media items
6. **Delete Media**: Remove media items (with confirmation)

## Using the Admin Interface

### Adding New Media Items
1. Click "Add Media Item" button
2. Fill in the form:
   - **Title**: Required text field
   - **Description**: Required textarea
   - **Image**: Required file upload
3. Image requirements:
   - Maximum file size: 50MB
   - Minimum resolution: 1920×1080 pixels
   - Supported formats: PNG, JPG, WEBP
4. Click "Save" to create the item

### Editing Media Items
1. Click the edit button (pencil icon) for any item
2. Modify the title, description, or image
3. To change image: Click the X button to remove existing, then upload new
4. Click "Update" to save changes

### Deleting Media Items
1. Click the delete button (trash icon) for any item
2. Confirm deletion in the popup
3. Both the database record and storage file will be removed

### Search and Filtering
- **Search**: Type in the search box to filter by title or ID
- **Date Filter**: Click the calendar button to select a date range
- Results update automatically as you type or change filters

## Technical Features

### Security
- Row Level Security (RLS) enabled on all tables
- Authentication required for all admin operations
- Protected routes with automatic redirects
- Secure file upload with validation

### Image Processing
- Client-side validation for file size and resolution
- Automatic thumbnail generation using Supabase image transformations
- Optimized thumbnails (480px width, quality 80%)

### Responsive Design
- Mobile-friendly interface
- Responsive table layout
- Touch-friendly controls

### Error Handling
- Comprehensive form validation
- User-friendly error messages
- Loading states for all operations
- Network error handling

## Maintenance

### Monitoring Usage
- Check Supabase dashboard for storage usage
- Monitor database size and performance
- Review authentication logs

### Backup Considerations
- Database is automatically backed up by Supabase
- Storage files are replicated across regions
- Consider exporting data periodically for additional backup

## Troubleshooting

### Common Issues
1. **Can't login**: Verify user exists in Supabase Auth dashboard
2. **Upload fails**: Check file size (max 50MB) and resolution (min 1920×1080)
3. **Images not displaying**: Verify storage bucket is public
4. **Permissions error**: Check RLS policies are correctly configured

### Support
- Check Supabase logs for backend errors
- Use browser developer tools for frontend debugging
- Review network requests for API issues

## Security Notes
- The admin interface is not linked from the public site
- Only authenticated users can access admin features
- All file uploads are validated before storage
- Regular security updates should be applied

---

**Important**: Keep your admin credentials secure and consider implementing additional security measures like 2FA for production use.