import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import supabase from '../config/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckCache, setAdminCheckCache] = useState<{ email: string; isAdmin: boolean; timestamp: number } | null>(null);

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user?.email) {
          await checkAdminStatus(currentSession.user.email);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user?.email) {
          await checkAdminStatus(currentSession.user.email);
          setLoading(false);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userEmail: string, forceCheck: boolean = false) => {
    try {
      if (!userEmail) {
        setIsAdmin(false);
        return;
      }

      // Check cache first - valid for 5 minutes
      const now = Date.now();
      if (!forceCheck && adminCheckCache && 
          adminCheckCache.email === userEmail && 
          now - adminCheckCache.timestamp < 5 * 60 * 1000) {
        setIsAdmin(adminCheckCache.isAdmin);
        console.log(`Admin check (cached) for ${userEmail}: ${adminCheckCache.isAdmin}`);
        return;
      }

      // Add timeout to prevent hanging (10 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Admin check timeout')), 10000); // 10 second timeout
      });

      const queryPromise = supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_emails')
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        // If timeout or error, use cached value if available
        if (adminCheckCache && adminCheckCache.email === userEmail) {
          setIsAdmin(adminCheckCache.isAdmin);
          console.log(`Admin check error, using cached value for ${userEmail}: ${adminCheckCache.isAdmin}`);
          return;
        }
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      if (!data) {
        console.warn('No admin_emails setting found in site_settings');
        setIsAdmin(false);
        return;
      }
      
      // Parse JSON array from setting_value
      const adminEmails = JSON.parse(data.setting_value || '[]');
      const isUserAdmin = adminEmails.includes(userEmail);
      
      // Update cache
      setAdminCheckCache({
        email: userEmail,
        isAdmin: isUserAdmin,
        timestamp: now
      });
      
      console.log(`Admin check for ${userEmail}: ${isUserAdmin}`);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      // Use cached value on error
      if (adminCheckCache && adminCheckCache.email === userEmail) {
        setIsAdmin(adminCheckCache.isAdmin);
        console.log(`Admin check error, using cached value for ${userEmail}: ${adminCheckCache.isAdmin}`);
        return;
      }
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
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
    setIsAdmin(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
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
