import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../config/supabaseClient';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdminResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checking, setChecking] = useState(true); // prevent flash of error
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state change FIRST — this fires when Supabase
    // exchanges the URL hash token (both recovery and invite types).
    // This avoids the race condition where getSession() runs before
    // the token is exchanged.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Legitimate password reset link
          setValidToken(true);
          setChecking(false);
        } else if (event === 'SIGNED_IN' && session) {
          // Could be an invite link — redirect to register instead
          const isInvite = window.location.hash.includes('type=invite');
          if (isInvite) {
            navigate('/admin/register');
            return;
          }
          // Otherwise a regular session exists — allow reset
          setValidToken(true);
          setChecking(false);
        } else if (event === 'SIGNED_OUT' || !session) {
          setValidToken(false);
          setChecking(false);
          setError('Invalid or expired reset link. Please request a new one.');
        }
      }
    );

    // Fallback: if no auth state change fires within 3s,
    // check session manually (handles page refreshes)
    const fallbackTimer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setValidToken(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
      setChecking(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/admin/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          {/* Checking token validity */}
          {checking ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Verifying reset link...</p>
            </div>
          ) : success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
                ✅ Password updated successfully! Redirecting to login…
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                  {error}
                  {!validToken && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/login')}
                        className="text-sm underline text-red-600 dark:text-red-400"
                      >
                        Request a new reset link →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  disabled={!validToken}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={!validToken}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !validToken}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating…
                  </span>
                ) : (
                  'Set New Password'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Protected by Supabase Authentication
        </p>
      </div>
    </div>
  );
};

export default AdminResetPassword;