import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../config/supabaseClient';
import Button from '../../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    heroImages: 0,
    clientLogos: 0,
    projects: 0,
    inquiries: 0,
    bookings: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch hero images count (only active)
      const { count: heroCount } = await supabase
        .from('hero_images')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch client logos count (only active)
      const { count: logosCount } = await supabase
        .from('client_logos')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch total inquiries from all inquiry tables
      const inquiryTables = [
        'corporate_event_inquiries',
        'team_building_inquiries',
        'csr_inquiries',
        'training_program_inquiries',
      ];

      let totalInquiries = 0;
      for (const table of inquiryTables) {
        const { count } = await (supabase as any)
          .from(table)
          .select('*', { count: 'exact', head: true });
        totalInquiries += count || 0;
      }

      // Fetch bookings count
      const { count: bookingsCount } = await (supabase as any)
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      setStats({
        heroImages: heroCount || 0,
        clientLogos: logosCount || 0,
        projects: projectsCount || 0,
        inquiries: totalInquiries,
        bookings: bookingsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* <Button
                onClick={() => navigate('/')}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled
              >
                View Site
              </Button> */}
              <Button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hero Images Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hero Images
              </h2>
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Manage hero section background images and animations
            </p>
            <Button
              onClick={() => navigate('/admin/hero-images')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
            >
              Manage Hero Images
            </Button>
          </div>

          {/* Client Logos Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Client Logos
              </h2>
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Add, edit, or remove client logos from the sphere gallery
            </p>
            <Button
              onClick={() => navigate('/admin/client-logos')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
            >
              Manage Client Logos
            </Button>
          </div>

          {/* Projects Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projects
              </h2>
              <span className="text-2xl">💼</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Create and manage portfolio project showcase cards
            </p>
            <Button
              onClick={() => navigate('/admin/projects')}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
            >
              Manage Projects
            </Button>
          </div>

          {/* Inquiries Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inquiries
              </h2>
              <span className="text-2xl">📨</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              View and manage customer inquiries from all forms
            </p>
            <Button
              onClick={() => navigate('/admin/inquiries')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-auto"
            >
              View Inquiries
            </Button>
          </div>

          {/* Bookings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bookings
              </h2>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Manage appointment bookings and schedules
            </p>
            <Button
              onClick={() => navigate('/admin/bookings')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-auto"
            >
              View Bookings
            </Button>
          </div>

          {/* Media Library Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Media Library
              </h2>
              <span className="text-2xl">📁</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              Browse and manage all uploaded media files
            </p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-auto">
              Open Media Library
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.heroImages}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hero Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.clientLogos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Client Logos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.projects}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.inquiries}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Inquiries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.bookings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bookings</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
