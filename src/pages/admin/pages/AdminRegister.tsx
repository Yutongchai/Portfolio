import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../config/supabaseClient';

/**
 * ONE-TIME USE ONLY
 * Use this page to create your first admin account
 * After creating your admin, delete this file or set ALLOW_REGISTRATION to false
 */

const ALLOW_REGISTRATION = true; // Set to false after creating your admin

export default function AdminRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ALLOW_REGISTRATION) {
      setError('Registration is disabled. Contact administrator.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          data: {
            email_confirm: false, // Skip email confirmation for admin
          }
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Get current admin_emails from site_settings (key-value structure)
        const { data: settings, error: fetchError } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'admin_emails')
          .single();

        let adminEmails: string[] = [];
        
        if (!fetchError && settings?.setting_value) {
          // Parse existing admin emails
          adminEmails = JSON.parse(settings.setting_value);
        }
        
        // Add new email if not already present
        if (!adminEmails.includes(email)) {
          adminEmails.push(email);
          
          // Update or insert admin_emails setting
          const { error: upsertError } = await supabase
            .from('site_settings')
            .upsert({
              setting_key: 'admin_emails',
              setting_type: 'admin',
              setting_value: JSON.stringify(adminEmails)
            }, {
              onConflict: 'setting_key'
            });

          if (upsertError) {
            console.error('Failed to add to admin_emails:', upsertError);
          }
        }

        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (!ALLOW_REGISTRATION) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-black dark:via-neutral-950 dark:to-black">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">
            Registration Disabled
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Admin registration is currently disabled. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-black dark:via-neutral-950 dark:to-black p-4">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Create Admin Account
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            ⚠️ One-time use only. Delete this page after registration.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-green-800 dark:text-green-400 font-semibold mb-2">
              ✅ Account Created!
            </h3>
            <p className="text-green-700 dark:text-green-500 text-sm mb-3">
              Your admin account has been created successfully.
            </p>
            <p className="text-green-600 dark:text-green-600 text-xs">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>

            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            <strong>Security Note:</strong> After creating your admin account, set{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">
              ALLOW_REGISTRATION = false
            </code>{' '}
            in this file or delete it entirely.
          </p>
        </div>
      </div>
    </div>
  );
}
