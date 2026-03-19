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
  adminCheckComplete: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [adminCheckCache, setAdminCheckCache] = useState<{ email: string; isAdmin: boolean; timestamp: number } | null>(null);

  const checkInProgressRef = useRef(false);
  const currentRequestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user?.email) {
          await checkAdminStatus(currentSession.user.email);
        } else {
          setAdminCheckComplete(true);
        }
      } catch (error) {
        if (mounted) console.error('Error initializing auth:', error);
        setAdminCheckComplete(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    let authChangeTimeout: ReturnType<typeof setTimeout>;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        clearTimeout(authChangeTimeout);
        authChangeTimeout = setTimeout(async () => {
          if (!mounted) return;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setAdminCheckComplete(false); // reset on auth change

          if (currentSession?.user?.email) {
            await checkAdminStatus(currentSession.user.email);
            setLoading(false);
          } else {
            setIsAdmin(false);
            setAdminCheckComplete(true);
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
    const requestId = ++currentRequestIdRef.current;

    if (checkInProgressRef.current && !forceCheck) {
      console.log(`Admin check already in progress, skipping for ${userEmail}`);
      return;
    }

    try {
      checkInProgressRef.current = true;
      console.log(`[Request ${requestId}] Starting admin check for: ${userEmail}`);

      if (!userEmail) {
        setIsAdmin(false);
        setAdminCheckComplete(true);
        return;
      }

      const now = Date.now();
      if (!forceCheck && adminCheckCache &&
        adminCheckCache.email === userEmail &&
        now - adminCheckCache.timestamp < 5 * 60 * 1000) {
        console.log(`[Request ${requestId}] Admin check (cached) for ${userEmail}: ${adminCheckCache.isAdmin}`);
        if (requestId === currentRequestIdRef.current && mountedRef.current) {
          setIsAdmin(adminCheckCache.isAdmin);
          setAdminCheckComplete(true);
        }
        return;
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          if (requestId === currentRequestIdRef.current) {
            reject(new Error('Admin check timeout'));
          }
        }, 10000);
      });

      const queryPromise = supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_emails')
        .maybeSingle();

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (requestId !== currentRequestIdRef.current) {
        console.log(`[Request ${requestId}] Stale request, ignoring result`);
        return;
      }

      if (result.error) {
        console.error(`[Request ${requestId}] Error fetching admin emails:`, result.error);
        if (adminCheckCache && adminCheckCache.email === userEmail) {
          if (mountedRef.current) {
            setIsAdmin(adminCheckCache.isAdmin);
            setAdminCheckComplete(true);
          }
          return;
        }
        if (mountedRef.current) {
          setIsAdmin(false);
          setAdminCheckComplete(true);
        }
        return;
      }

      if (!result.data) {
        console.warn(`[Request ${requestId}] No admin_emails setting found in site_settings`);
        if (mountedRef.current) {
          setIsAdmin(false);
          setAdminCheckComplete(true);
        }
        return;
      }

      const adminEmails = JSON.parse(result.data.setting_value || '[]');
      const isUserAdmin = adminEmails.includes(userEmail);

      setAdminCheckCache({ email: userEmail, isAdmin: isUserAdmin, timestamp: now });

      console.log(`[Request ${requestId}] Admin check completed for ${userEmail}: ${isUserAdmin}`);

      if (mountedRef.current) {
        setIsAdmin(isUserAdmin);
        setAdminCheckComplete(true); // ← mark as done
      }

    } catch (error: any) {
      if (requestId !== currentRequestIdRef.current) return;
      console.error(`[Request ${requestId}] Admin check error for ${userEmail}:`, error.message || error);
      if (adminCheckCache && adminCheckCache.email === userEmail) {
        if (mountedRef.current) {
          setIsAdmin(adminCheckCache.isAdmin);
          setAdminCheckComplete(true);
        }
      } else if (mountedRef.current) {
        setIsAdmin(false);
        setAdminCheckComplete(true);
      }
    } finally {
      if (requestId === currentRequestIdRef.current) {
        checkInProgressRef.current = false;
      }
    }
  };

  const refreshAdminStatus = async () => {
    if (user?.email) {
      setAdminCheckComplete(false);
      await checkAdminStatus(user.email, true);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (mountedRef.current) {
      setIsAdmin(false);
      setAdminCheckComplete(false);
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
    adminCheckComplete,
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