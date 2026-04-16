import React, { createContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        localStorage.setItem('token', token);
        try {
          const data = await getProfile();
          setUser({ isLoggedIn: true, ...data });
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    };
    fetchUserProfile();
  }, [token]);

  const logout = () => {
    setToken(null);
    window.location.href = '/';
  };
  
  return (
    <AuthContext.Provider value={{ user, token, setToken, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
