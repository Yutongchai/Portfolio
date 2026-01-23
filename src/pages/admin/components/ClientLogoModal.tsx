import React, { useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface ClientLogoModalProps {
  onClose: () => void;
}

const ClientLogoModal: React.FC<ClientLogoModalProps> = ({ onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one logo file');
      return;
    }

    if (!companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`Uploading logo ${i + 1} of ${selectedFiles.length}...`);
        
        // Upload to Supabase Storage
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        console.log('Uploading to storage bucket:', fileName);
        
        const uploadPromise = supabase.storage
          .from('client-logos')
          .upload(fileName, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Upload timeout')), 60000);
        });

        const { data: uploadData, error: uploadError } = await Promise.race([
          uploadPromise,
          timeoutPromise
        ]) as any;

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        console.log('Upload successful:', uploadData);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('client-logos')
          .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await supabase
          .from('client_logos')
          .insert({
            company_name: companyName,
            logo_url: publicUrl,
            website_url: websiteUrl || null,
            alt_text: `${companyName} logo`,
            is_active: true,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          await supabase.storage.from('client-logos').remove([fileName]);
          throw new Error(`Database insert failed: ${dbError.message}`);
        }

        setUploadProgress({ current: i + 1, total: selectedFiles.length });
      }

      console.log('All logos uploaded successfully!');
      alert(`Successfully uploaded ${selectedFiles.length} logo(s)!`);
      onClose();
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(`Failed to upload logo: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Client Logo
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website URL (optional)
              </label>
              <Input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo File(s) * (PNG, JPG, SVG)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileChange}
                multiple
                required
                className="block w-full text-sm text-gray-900 dark:text-gray-300 
                         file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         dark:file:bg-blue-900 dark:file:text-blue-300
                         hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
              {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? (
                `Uploading (${uploadProgress.current}/${uploadProgress.total})...`
              ) : (
                `Upload ${selectedFiles.length > 1 ? 'All' : 'Logo'}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLogoModal;
