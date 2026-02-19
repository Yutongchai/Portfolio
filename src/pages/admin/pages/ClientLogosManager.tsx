import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';
import ClientLogoModal from '../components/ClientLogoModal';
import ClientMarquee from '../../personal-story-section/components/ClientMarquee';

interface ClientLogo {
  id: number;
  company_name: string;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const ClientLogosManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; logoUrl: string } | null>(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  useEffect(() => {
    fetchLogos();
  }, []);

  // (No auto-rotate needed when using the marquee preview)

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching client logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, logoUrl: string) => {
    setDeleteConfirm({ id, logoUrl });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from('client_logos')
        .update({ is_active: false })
        .eq('id', deleteConfirm.id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchLogos();
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Failed to delete logo');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchLogos();
  };

  // Extract just the image URLs for the 3D gallery
  const logoUrls = logos.map(logo => logo.logo_url);
  // alias as `clients` for the gallery props requested
  const clients = logoUrls;

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
                Manage Client Logos
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
                + Add New Logo
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
      <main className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-4 px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Side - Logo List */}
        <div className="w-full lg:w-1/2 overflow-y-auto pr-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Logos</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                <div className="text-sm text-gray-500 dark:text-gray-400">Marquee</div>
            </span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
          ) : (
            <>
              {logos.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4">No client logos yet.</p>
                  <p className="text-sm mt-1">Click "Add New Logo" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {logos.map((logo) => (
                    <div
                      key={logo.id}
                      className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 p-3"
                    >
                      {/* Delete Button X - top right */}
                      <button
                        onClick={() => handleDelete(logo.id, logo.logo_url)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        title="Delete logo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Logo Preview */}
                      <div className="aspect-square w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded p-2">
                        <img
                          src={logo.logo_url}
                          alt={logo.company_name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* Company Name */}
                      <div className="mt-2 text-center">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {logo.company_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Added: {new Date(logo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side - Live Preview */}
        <div className="w-full lg:w-1/2 sticky top-0">
          <div className="relative rounded-lg overflow-hidden shadow-lg h-72 md:h-80 bg-white dark:bg-gray-800 p-4 md:p-8 border-2 border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h2>

              <div className="text-sm text-gray-500 dark:text-gray-400">Live Preview</div>
            </div>

            {logos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p>No logos to preview</p>
                <p className="text-sm mt-1">Add logos to see them here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Render same marquee as home page for preview */}
                <div>
                  {clients.length > 0 ? (
                    <ClientMarquee logos={clients} autoScrollSpeed={0.6} pauseOnHover={true} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-500">No logos to preview</div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Logos</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{logos.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Preview Mode</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">Marquee</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview instructions */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Live Preview:</span> Changes made to logos will instantly update in the preview above.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <ClientLogoModal onClose={handleModalClose} />
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
                Delete Logo
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this logo? This action is <span className="font-semibold text-red-600 dark:text-red-400">IRREVERSIBLE</span> and the logo will be permanently removed.
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

export default ClientLogosManager;