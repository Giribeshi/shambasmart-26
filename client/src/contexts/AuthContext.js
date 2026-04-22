import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrimind-token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Demo mode for frontend-only deployment
  const isDemoMode = !process.env.REACT_APP_API_URL || window.location.hostname !== 'localhost';

  // Set up axios defaults for authenticated requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is valid on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Check if we're in demo mode
          if (isDemoMode && token === 'demo-token') {
            // Use demo user data
            const demoUser = {
              id: '2',
              email: 'farmer@shambasmart.co.tz',
              name: 'John Farmer',
              role: 'farmer',
              location: 'arusha',
              phone: '+255987654321',
              farmSize: 'small',
              primaryCrops: ['maize', 'tomatoes']
            };
            setUser(demoUser);
          } else {
            // Try backend verification
            const response = await axios.get('/api/auth/verify');
            setUser(response.data.user);
          }
        } catch (error) {
          // If backend fails and we're in demo mode, use demo user
          if (isDemoMode && token === 'demo-token') {
            const demoUser = {
              id: '2',
              email: 'farmer@shambasmart.co.tz',
              name: 'John Farmer',
              role: 'farmer',
              location: 'arusha',
              phone: '+255987654321',
              farmSize: 'small',
              primaryCrops: ['maize', 'tomatoes']
            };
            setUser(demoUser);
          } else {
            console.error('Token verification failed:', error);
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token, isDemoMode]);

  const login = async (email, password) => {
    try {
      setError('');
      
      // Demo mode - bypass backend for frontend-only deployment
      if (isDemoMode) {
        const demoUser = {
          id: '2',
          email: email || 'farmer@shambasmart.co.tz',
          name: 'John Farmer',
          role: 'farmer',
          location: 'arusha',
          phone: '+255987654321',
          farmSize: 'small',
          primaryCrops: ['maize', 'tomatoes']
        };
        
        setUser(demoUser);
        setToken('demo-token');
        localStorage.setItem('agrimind-token', 'demo-token');
        
        return { success: true, user: demoUser };
      }
      
      // Real backend login
      const response = await axios.post('/api/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('agrimind-token', userToken);
      
      return { success: true, user: userData };
    } catch (error) {
      // Demo mode fallback
      if (isDemoMode) {
        const demoUser = {
          id: '2',
          email: email || 'farmer@shambasmart.co.tz',
          name: 'John Farmer',
          role: 'farmer',
          location: 'arusha',
          phone: '+255987654321',
          farmSize: 'small',
          primaryCrops: ['maize', 'tomatoes']
        };
        
        setUser(demoUser);
        setToken('demo-token');
        localStorage.setItem('agrimind-token', 'demo-token');
        
        return { success: true, user: demoUser };
      }
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await axios.post('/api/auth/register', userData);
      const { user: newUser, token: userToken } = response.data;
      
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('agrimind-token', userToken);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrimind-token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      setError('');
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
