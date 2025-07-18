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
      
      if (data.success) {
        // Auto login after successful registration
        return this.login(email, password);
      }
      
      throw new Error(data.message || 'Registration failed');
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
  }
};