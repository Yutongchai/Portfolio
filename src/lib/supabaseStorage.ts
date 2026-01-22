import supabase from '../config/supabaseClient';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The bucket name (hero-images, client-logos, project-images)
 * @param folder - Optional subfolder
 * @returns Public URL of the uploaded file
 */
export async function uploadToSupabase(
  file: File,
  bucket: 'hero-images' | 'client-logos' | 'project-images',
  folder?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file
 * @param bucket - The bucket name
 */
export async function deleteFromSupabase(
  url: string,
  bucket: 'hero-images' | 'client-logos' | 'project-images'
): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid URL format');
    }
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get all files in a bucket
 * @param bucket - The bucket name
 * @param folder - Optional subfolder
 */
export async function listFiles(
  bucket: 'hero-images' | 'client-logos' | 'project-images',
  folder?: string
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
