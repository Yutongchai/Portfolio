import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import HeroImageModal from '../components/HeroImageModal';
import HeroSection from '../../personal-story-section/components/HeroSection';

interface HeroImage {
  id: number;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const HeroImagesManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; imageUrl: string } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (focusLatest: boolean = false) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true) // Only fetch active images
        .order('created_at', { ascending: false });

      if (error) throw error;
      const imgs = data || [];
      setImages(imgs);
      if (focusLatest && imgs.length > 0) {
        // show the most-recent image immediately
        setCurrentImageIndex(0);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cycle preview images every 5 seconds; reset when images length changes
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // If the current index is out of bounds after add/delete, reset to 0
  useEffect(() => {
    if (currentImageIndex >= images.length) setCurrentImageIndex(0);
  }, [images.length, currentImageIndex]);

  const handleDelete = async (id: number, imageUrl: string) => {
    setDeleteConfirm({ id, imageUrl });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      // Soft delete - set is_active to false
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: false })
        .eq('id', deleteConfirm.id);

      if (error) throw error;
      setDeleteConfirm(null);
      // refresh and focus latest (so preview updates immediately)
      fetchImages(true);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // after adding a new image, refresh and show it immediately
    fetchImages(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-blue-600 dark:text-blue-400 hover:underline mb-2 text-sm"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Hero Images
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                + Add New Image
              </Button>
              <Button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen Layout */}
      <main className="h-[calc(100vh-120px)] flex gap-4 px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Side - Image List */}
        <div className="w-1/2 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Images</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
          ) : (
            <>
              {images.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No hero images yet. Click "Add New Image" to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
                    >
                      {/* Delete Button X - top right */}
                      <button
                        onClick={() => handleDelete(image.id, image.image_url)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        title="Delete image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Image Preview */}
                      <div className="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={image.image_url}
                          alt={image.title || 'Hero image'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Image Info */}
                      <div className="p-2">
                        {image.title && (
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{image.title}</p>
                        )}
                        {image.subtitle && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{image.subtitle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side - Live Preview */}
        <div className="w-1/2 sticky top-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 p-4">
            <HeroSection preview />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Preview shows the first active image as it will appear on your homepage
          </p>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <HeroImageModal onClose={handleModalClose} />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                Delete Image
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this image? This action is <span className="font-semibold text-red-600 dark:text-red-400">IRREVERSIBLE</span> and the image will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImagesManager;
