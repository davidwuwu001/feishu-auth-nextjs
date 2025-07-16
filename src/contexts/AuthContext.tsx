'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// 用户接口定义
interface User {
  record_id: string;
  username: string;
  email: string;
  phone?: string;
  status: string;
  created_time: number;
  last_login?: number;
}

// 认证上下文接口
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取当前用户信息
  const fetchUser = async () => {
    try {
      const token = Cookies.get('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        // 如果获取用户信息失败，清除token
        Cookies.remove('auth-token');
        setUser(null);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // 清除无效的token
      Cookies.remove('auth-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 用户登录
  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
        password,
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        // Cookie已经在服务端设置，这里设置客户端cookie用于前端访问
        Cookies.set('auth-token', response.data.data.token, {
          expires: 7, // 7天
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      const message = error.response?.data?.message || '登录失败，请稍后重试';
      return { success: false, message };
    }
  };

  // 用户注册
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      const message = error.response?.data?.message || '注册失败，请稍后重试';
      return { success: false, message };
    }
  };

  // 用户登出
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论请求是否成功，都清除本地状态
      setUser(null);
      Cookies.remove('auth-token');
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    await fetchUser();
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 使用认证上下文的Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}