import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  toggleEditMode: () => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Simple password protection - in production, use proper authentication
const ADMIN_PASSWORD = 'admin123'; // Change this!

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin-auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('admin-auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const toggleEditMode = () => {
    if (isAuthenticated) {
      setIsEditMode((prev) => !prev);
    }
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
  };

  return (
    <AdminContext.Provider
      value={{
        isEditMode,
        isAuthenticated,
        toggleEditMode,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
