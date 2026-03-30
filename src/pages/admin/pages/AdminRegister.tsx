import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../config/supabaseClient';

/**
 * Admin Registration Page
 * Handles two cases:
 * 1. Fresh signup (new user)
 * 2. Invited user setting their password for the first time
 *
 * After registering, set ALLOW_REGISTRATION = false
 */

const ALLOW_REGISTRATION = false; // Set to false after all admins are set up

type Mode = 'signup' | 'invited';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Detect if user arrived via an invite link
  // Supabase invite links sign the user in automatically via the URL hash
  useEffect(() => {
    const checkInviteSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is already signed in — they came from an invite link
        setMode('invited');
        setEmail(session.user.email || '');
      }
    };
    checkInviteSession();
  }, []);

  const insertAdminUser = async (userId: string, userEmail: string) => {
    const { error } = await supabase
      .from('admin_users')
      .upsert({ user_id: userId, email: userEmail }, { onConflict: 'user_id' });
    if (error) throw new Error(`Failed to grant admin access: ${error.message}`);
  };

  // Case 1: Invited user — they're already signed in, just need to set password
  const handleInvitedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      // Update password for the already-authenticated invited user
      const { data, error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      if (data.user) {
        await insertAdminUser(data.user.id, data.user.email!);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err: any) {
      console.error('Password set error:', err);
      setError(err.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  // Case 2: Fresh signup — create new user then grant admin
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ALLOW_REGISTRATION) return setError('Registration is disabled. Contact administrator.');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user returned from signup');

      await insertAdminUser(authData.user.id, email);

      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (!ALLOW_REGISTRATION && mode !== 'invited') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">Registration Disabled</h2>
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
            {mode === 'invited' ? 'Set Your Password' : 'Create Admin Account'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {mode === 'invited'
              ? `Welcome! Set a password for ${email}`
              : '⚠️ One-time use only. Delete this page after registration.'}
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-green-800 dark:text-green-400 font-semibold mb-2">✅ All Done!</h3>
            <p className="text-green-700 dark:text-green-500 text-sm mb-3">
              {mode === 'invited'
                ? 'Password set and admin access granted. Redirecting to dashboard...'
                : 'Account created successfully. Redirecting to login...'}
            </p>
          </div>
        ) : (
          <form onSubmit={mode === 'invited' ? handleInvitedUser : handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email — editable only on fresh signup */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={mode === 'invited'}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs text-neutral-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading
                ? (mode === 'invited' ? 'Setting Password...' : 'Creating Account...')
                : (mode === 'invited' ? 'Set Password & Enter Dashboard' : 'Create Admin Account')}
            </button>

            {mode === 'signup' && (
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
            )}
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            <strong>Security Note:</strong> After all admins are set up, set{' '}
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