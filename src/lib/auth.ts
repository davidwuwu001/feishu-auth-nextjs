import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// 用户接口定义
export interface User {
  record_id: string;
  username: string;
  email: string;
  phone?: string;
  status: string;
  created_time: number;
  last_login?: number;
}

// JWT相关配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// 生成JWT令牌
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 验证JWT令牌
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('无效的令牌');
  }
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 从请求中获取用户信息
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // 从cookie中获取token
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // 验证token
    const decoded = verifyToken(token);
    return decoded.user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 邮箱格式验证
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 密码强度验证
export function isValidPassword(password: string): boolean {
  // 至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

// 用户名格式验证
export function isValidUsername(username: string): boolean {
  // 3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// 统一的API响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 创建成功响应
export function createSuccessResponse<T>(data?: T, message: string = '操作成功'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

// 创建错误响应
export function createErrorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    error,
  };
}