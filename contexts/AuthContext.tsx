import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'https://api.freeapi.app/api/v1';
const TOKEN_KEY = 'authToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  // =========================
  // CHECK AUTH STATE
  // =========================
  const checkAuthState = async () => {
    try {
      console.log('🔐 Checking auth state...');

      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      console.log('🔑 Stored Token:', token ? 'EXISTS' : 'NOT FOUND');

      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📥 /users/me status:', response.status);

      // ❌ FIX: HTML response crash protection
      const text = await response.text();

      let userData;
      try {
        userData = JSON.parse(text);
      } catch (err) {
        console.log('❌ Invalid JSON from /users/me:', text);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        console.log('✅ Auth valid user:', userData?.data);
        setUser(userData.data);
      } else {
        console.log('❌ Invalid token, clearing...');
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.log('🚨 Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email: string, password: string) => {
    try {
      console.log('📤 LOGIN REQUEST:', { email });

      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('📥 LOGIN RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { accessToken, user: userData } = data.data;

      console.log('🔑 Token received:', accessToken ? 'YES' : 'NO');
      console.log('👤 User:', userData);

      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      setUser(userData);

      console.log('✅ LOGIN SUCCESS');
    } catch (error) {
      console.log('❌ LOGIN ERROR:', error);
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'Something went wrong'
      );
      throw error;
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (
    username: string,
    name: string,
    email: string,
    password: string
  ) => {
    try {
      console.log('📤 REGISTER REQUEST:', { username, email });

      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, email, password }),
      });

      const data = await response.json();

      console.log('📥 REGISTER RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const userData = data.data.user || data.data;

      console.log('✅ REGISTER SUCCESS:', userData);

      try {
        await login(email, password);
      } catch (err) {
        console.log('⚠️ Auto login failed, setting user only');
        setUser(userData);
      }
    } catch (error) {
      console.log('❌ REGISTER ERROR:', error);
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Something went wrong'
      );
      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    console.log('🚪 Logging out...');
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  };

  // =========================
  // REFRESH TOKEN
  // =========================
  const refreshToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return;

      const response = await fetch(`${API_BASE}/users/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('🔄 Token refreshed');
        await SecureStore.setItemAsync(
          TOKEN_KEY,
          data.data.accessToken
        );
      }
    } catch (error) {
      console.log('❌ Token refresh failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};