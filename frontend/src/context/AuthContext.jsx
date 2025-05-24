import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifie si un utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Fonction d’inscription
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
