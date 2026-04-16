import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        localStorage.setItem('token', token);
        try {
          const res = await fetch('http://localhost:5000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser({ isLoggedIn: true, ...data }); 
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
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
