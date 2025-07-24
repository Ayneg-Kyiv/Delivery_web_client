import { signIn, signOut } from 'next-auth/react';
import { ApiClient } from './api-client';

export const AuthService = {
  async login(email: string, password: string) {
    return signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  },

  async register(email: string, password: string) {
    try {
      const data = await ApiClient.post('/auth/signup', { email, password });
      
      return data;
    } catch (error) {  
      throw error;
    }
  },

  async logout() {
  try {
    await ApiClient.post('/auth/signout');

    } catch (e) {
      // Optionally handle/log error, but proceed to signOut anyway
    }
    return await signOut({ redirect: false });
  },

  async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const response = await ApiClient.post('/auth/reset-password', { email, token, newPassword });
    
      return response;
    } catch (error) {
      throw error;
    }
  }
};