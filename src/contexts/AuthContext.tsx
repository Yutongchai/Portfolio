import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import supabase from '../config/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckCache, setAdminCheckCache] = useState<{ email: string; isAdmin: boolean; timestamp: number } | null>(null);

  // Use refs to prevent race conditions
  const checkInProgressRef = useRef(false);
  const currentRequestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user?.email) {
          await checkAdminStatus(currentSession.user.email);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error initializing auth:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Debounce auth state changes to prevent multiple rapid calls
    let authChangeTimeout: ReturnType<typeof setTimeout>;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        // Clear any pending auth change
        clearTimeout(authChangeTimeout);

        // Debounce by 500ms to prevent multiple rapid calls
        authChangeTimeout = setTimeout(async () => {
          if (!mounted) return;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user?.email) {
            await checkAdminStatus(currentSession.user.email);
            setLoading(false);
          } else {
            setIsAdmin(false);
            setLoading(false);
          }
        }, 500);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(authChangeTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userEmail: string, forceCheck: boolean = false) => {
    // Generate a unique ID for this request
    const requestId = ++currentRequestIdRef.current;

    // Skip if already in progress (unless forced)
    if (checkInProgressRef.current && !forceCheck) {
      console.log(`Admin check already in progress, skipping for ${userEmail}`);
      return;
    }

    try {
      checkInProgressRef.current = true;
      console.log(`[Request ${requestId}] Starting admin check for: ${userEmail}`);

      if (!userEmail) {
        setIsAdmin(false);
        return;
      }

      // Check cache first - valid for 5 minutes
      const now = Date.now();
      if (!forceCheck && adminCheckCache &&
        adminCheckCache.email === userEmail &&
        now - adminCheckCache.timestamp < 5 * 60 * 1000) {
        console.log(`[Request ${requestId}] Admin check (cached) for ${userEmail}: ${adminCheckCache.isAdmin}`);

        // Only update if this is the most recent request
        if (requestId === currentRequestIdRef.current && mountedRef.current) {
          setIsAdmin(adminCheckCache.isAdmin);
        }
        return;
      }

      // Use a shorter timeout for better UX
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          if (requestId === currentRequestIdRef.current) {
            reject(new Error('Admin check timeout'));
          }
        }, 10000); // 10 seconds
      });

      const queryPromise = supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_emails')
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;

      // If this is not the latest request, ignore the result
      if (requestId !== currentRequestIdRef.current) {
        console.log(`[Request ${requestId}] Stale request, ignoring result`);
        return;
      }

      if (result.error) {
        console.error(`[Request ${requestId}] Error fetching admin emails:`, result.error);

        // Use cached value if available
        if (adminCheckCache && adminCheckCache.email === userEmail) {
          console.log(`[Request ${requestId}] Using cached value after error for ${userEmail}: ${adminCheckCache.isAdmin}`);
          if (mountedRef.current) {
            setIsAdmin(adminCheckCache.isAdmin);
          }
          return;
        }

        if (mountedRef.current) {
          setIsAdmin(false);
        }
        return;
      }

      if (!result.data) {
        console.warn(`[Request ${requestId}] No admin_emails setting found in site_settings`);
        if (mountedRef.current) {
          setIsAdmin(false);
        }
        return;
      }

      // Parse JSON array from setting_value
      const adminEmails = JSON.parse(result.data.setting_value || '[]');
      const isUserAdmin = adminEmails.includes(userEmail);

      // Update cache
      const newCache = {
        email: userEmail,
        isAdmin: isUserAdmin,
        timestamp: now
      };

      setAdminCheckCache(newCache);

      console.log(`[Request ${requestId}] Admin check completed for ${userEmail}: ${isUserAdmin}`);

      if (mountedRef.current) {
        setIsAdmin(isUserAdmin);
      }

    } catch (error: any) {
      // Only process errors for the latest request
      if (requestId !== currentRequestIdRef.current) {
        return;
      }

      console.error(`[Request ${requestId}] Admin check error for ${userEmail}:`, error.message || error);

      // Use cached value on error
      if (adminCheckCache && adminCheckCache.email === userEmail) {
        console.log(`[Request ${requestId}] Using cached value after exception for ${userEmail}: ${adminCheckCache.isAdmin}`);
        if (mountedRef.current) {
          setIsAdmin(adminCheckCache.isAdmin);
        }
      } else if (mountedRef.current) {
        setIsAdmin(false);
      }
    } finally {
      // Only reset if this is the current request
      if (requestId === currentRequestIdRef.current) {
        checkInProgressRef.current = false;
      }
    }
  };

  const refreshAdminStatus = async () => {
    if (user?.email) {
      await checkAdminStatus(user.email, true);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (mountedRef.current) {
      setIsAdmin(false);
      setAdminCheckCache(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    refreshAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};