import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface HeroImageModalProps {
  onClose: () => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject(new Error('Canvas is empty'));
    }, 'image/jpeg');
  });
}

const HeroImageModal: React.FC<HeroImageModalProps> = ({ onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setCurrentFileIndex(0);
      
      // Load first file for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(filesArray[0]);
    }
  };

  const loadNextFile = () => {
    const nextIndex = currentFileIndex + 1;
    if (nextIndex < selectedFiles.length) {
      setCurrentFileIndex(nextIndex);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(selectedFiles[nextIndex]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0 || !croppedAreaPixels) {
      alert('Please select at least one image and adjust the crop');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      // Upload current file
      console.log(`Uploading image ${currentFileIndex + 1} of ${selectedFiles.length}...`);
      const currentFile = selectedFiles[currentFileIndex];
      
      // Get cropped image blob
      const croppedImageBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      console.log('Image cropped successfully, size:', croppedImageBlob.size, 'bytes');
      
      // Upload to Supabase Storage with timeout
      const fileName = `${Date.now()}_${currentFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('Uploading to storage bucket:', fileName);
      
      const uploadPromise = supabase.storage
        .from('hero-images')
        .upload(fileName, croppedImageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout - please check your internet connection')), 60000);
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
        .from('hero-images')
        .getPublicUrl(fileName);

      // Insert into database
      const { error: dbError } = await supabase
        .from('hero_images')
        .insert({
          title: currentFile.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as title
          alt_text: null,
          image_url: publicUrl,
          is_active: true,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        await supabase.storage.from('hero-images').remove([fileName]);
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      setUploadProgress({ current: currentFileIndex + 1, total: selectedFiles.length });

      // Check if there are more files to upload
      if (currentFileIndex + 1 < selectedFiles.length) {
        loadNextFile();
        // Reset crop for next image
        setCroppedAreaPixels(null);
      } else {
        // All files uploaded
        console.log('All images uploaded successfully!');
        alert(`Successfully uploaded ${selectedFiles.length} image(s)!`);
        onClose();
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image ${currentFileIndex + 1}: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Hero Image
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Images *
              </label>
              <input
                type="file"
                accept="image/*"
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
                  {selectedFiles.length} file(s) selected. Cropping image {currentFileIndex + 1} of {selectedFiles.length}
                </p>
              )}
            </div>

            {previewUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Crop Image {currentFileIndex + 1}
                </label>
                <div className="relative h-96 bg-gray-200 dark:bg-gray-700 rounded">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom
                  </label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
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
                currentFileIndex + 1 < selectedFiles.length 
                  ? `Upload & Next (${uploadProgress.current}/${uploadProgress.total})`
                  : `Uploading (${uploadProgress.current}/${uploadProgress.total})...`
              ) : (
                currentFileIndex + 1 < selectedFiles.length
                  ? `Upload & Next (${currentFileIndex + 1}/${selectedFiles.length})`
                  : `Upload ${selectedFiles.length > 1 ? 'All' : 'Image'}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroImageModal;
