'use client';

import { User } from '@prisma/client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: null | User;
  login: (userData: any) => void;
  logout: () => void;
  isUserLogged: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isUserLogged = () => {
    return !!user;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isUserLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
