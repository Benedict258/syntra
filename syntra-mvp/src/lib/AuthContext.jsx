import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState(null);

  useEffect(() => {
    bootstrapTokenFromUrl();
    checkUserAuth();
  }, []);

  const bootstrapTokenFromUrl = () => {
    if (typeof window === 'undefined') {
      return;
    }
    const url = new URL(window.location.href);
    const token = url.searchParams.get('access_token');
    if (token) {
      authApi.setSessionToken(token);
      url.searchParams.delete('access_token');
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthError(null);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      if (error.status === 401) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      } else if (error.status === 403 && error.data?.code === 'user_not_registered') {
        setAuthError({
          type: 'user_not_registered',
          message: 'User not registered for this app'
        });
      } else {
        setAuthError({
          type: 'unknown',
          message: error.message || 'Unable to authenticate'
        });
      }
    }
  }, []);

  const logout = async (shouldRedirect = true) => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      authApi.redirectToLogin();
    }
  };

  const navigateToLogin = () => {
    authApi.redirectToLogin();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState: checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
