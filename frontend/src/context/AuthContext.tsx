/**
 * @file AuthContext.tsx
 * @description React Context managing the application's global authentication state and token refresh cycle.
 * 
 * PURPOSE:
 * Tracks the logged-in user profile, handles token refresh loops on boot, and provides
 * functions (`login`, `register`, `logout`) to child views.
 * 
 * ROLE IN FRONTEND:
 * Wrapped at `main.tsx` level to make the authentication state accessible across all React routes.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UserResponseData, LoginPayload, RegisterPayload } from '../api/auth.api';
import { axiosClient } from '../api/axiosClient';

interface AuthContextType {
  user: UserResponseData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Helper that stores the JWT token in localStorage and attaches it to Axios headers.
   */
  const handleAuthSuccess = (accessToken: string, userData: UserResponseData) => {
    localStorage.setItem('codepulse_access_token', accessToken);
    setUser(userData);
  };

  /**
   * Helper that clears storage and token headers.
   */
  const handleAuthClear = () => {
    localStorage.removeItem('codepulse_access_token');
    setUser(null);
  };

  /**
   * Authenticates credentials, stores token, and updates global user state.
   */
  const login = async (payload: LoginPayload) => {
    try {
      const resp = await authApi.login(payload);
      handleAuthSuccess(resp.data.accessToken, resp.data.user);
    } catch (error) {
      handleAuthClear();
      throw error;
    }
  };

  /**
   * Registers a new user account, stores token, and updates global state.
   */
  const register = async (payload: RegisterPayload) => {
    try {
      const resp = await authApi.register(payload);
      handleAuthSuccess(resp.data.accessToken, resp.data.user);
    } catch (error) {
      handleAuthClear();
      throw error;
    }
  };

  /**
   * Logs out the user session and clears credentials.
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Error reporting logout to backend:', e);
    } finally {
      handleAuthClear();
    }
  };

  /**
   * Lifecycle check executed on boot to rebuild the user session.
   * Leverages the Refresh Token cookie to get a fresh Access Token if needed.
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('codepulse_access_token');
      
      if (token) {
        try {
          // Attempt fetching active session profile
          const resp = await authApi.getMe();
          setUser(resp.data.user);
        } catch {
          // If token was expired, try swapping it using the Refresh cookie
          try {
            const refreshResp = await authApi.refresh();
            const newAccessToken = refreshResp.data.accessToken;
            localStorage.setItem('codepulse_access_token', newAccessToken);
            
            const meResp = await authApi.getMe();
            setUser(meResp.data.user);
          } catch {
            handleAuthClear();
          }
        }
      } else {
        // If no token in storage, see if we can refresh session implicitly (silent refresh)
        try {
          const refreshResp = await authApi.refresh();
          const newAccessToken = refreshResp.data.accessToken;
          localStorage.setItem('codepulse_access_token', newAccessToken);
          
          const meResp = await authApi.getMe();
          setUser(meResp.data.user);
        } catch {
          handleAuthClear();
        }
      }
      setIsLoading(false);
    };

    bootstrapAuth();
  }, []);

  /**
   * Hook into Axios interceptors dynamically to capture downstream 401 errors
   * and trigger session token refreshes.
   */
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If request failed with 401 and hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshResp = await authApi.refresh();
            const newAccessToken = refreshResp.data.accessToken;
            
            localStorage.setItem('codepulse_access_token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Retry the original request
            return axiosClient(originalRequest);
          } catch {
            handleAuthClear();
            window.location.href = '/auth/login';
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be utilized inside an AuthProvider');
  }
  return context;
};
