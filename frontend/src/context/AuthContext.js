import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [id, setId] = useState(localStorage.getItem('id') || '');

  const [isAdminRegistered, setIsAdminRegistered] = useState(true);


  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/auth/check-admin`);
        setIsAdminRegistered(response.data.isAdminRegistered);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminRegistered(false); // Assume no admin if check fails
      }
    };
    checkAdminStatus();
  }, []);

  const logout = () => {
    setToken('');
    setRole('');
    setId('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole, isAdminRegistered, logout, id, setId }}>
      {children}
    </AuthContext.Provider>
  );
};