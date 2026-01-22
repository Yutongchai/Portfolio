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
  const [checkedEmails, setCheckedEmails] = useState<Set<string>>(new Set());
  const [inactivityTimeout, setInactivityTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto logout after 18 hours of inactivity
  const setupInactivityTimer = () => {
    // Clear existing timeout
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    // Set new timeout for 18 hours (64800000 ms)
    const timeout = setTimeout(async () => {
      console.log('Session expired after 18 hours of inactivity');
      await supabase.auth.signOut();
      setIsAdmin(false);
      setCheckedEmails(new Set());
    }, 18 * 60 * 60 * 1000); // 18 hours in milliseconds

    setInactivityTimeout(timeout);
  };

  // Reset inactivity timer on user activity
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      setupInactivityTimer();
    };

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    setupInactivityTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
    };
  }, [user]);

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
        } else {
          setIsAdmin(false);
          setCheckedEmails(new Set());
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userEmail: string) => {
    // Skip if already checked for this email
    if (checkedEmails.has(userEmail)) {
      return;
    }

    try {
      setCheckedEmails(prev => new Set(prev).add(userEmail));
      
      if (!userEmail) {
        setIsAdmin(false);
        return;
      }

      // Query without timeout first to see if it completes
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_emails')
        .limit(1);

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      if (!data || data.length === 0) {
        setIsAdmin(false);
        return;
      }
      
      // Parse JSON array from setting_value
      const adminEmails = JSON.parse(data[0]?.setting_value || '[]');
      const isUserAdmin = adminEmails.includes(userEmail);
      setIsAdmin(isUserAdmin);
    } catch (error) {
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
    setCheckedEmails(new Set());
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
