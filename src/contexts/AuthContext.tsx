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
        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user);
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

          if (currentSession?.user) {
            await checkAdminStatus(currentSession.user);
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

  const checkAdminStatus = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found, which just means not an admin
        console.error('Admin check error:', error);
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckComplete(true);
    }
  };
  const refreshAdminStatus = async () => {
    if (user?.email) {
      setAdminCheckComplete(false);
      await checkAdminStatus(user);
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