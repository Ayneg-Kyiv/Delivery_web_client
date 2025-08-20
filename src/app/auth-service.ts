import { signIn, signOut } from 'next-auth/react';
import { ApiClient } from './api-client';

export const AuthService = {
  async login(email: string, password: string, rememberMe: boolean) {
    return signIn('credentials', {
      email,
      password,
      rememberMe,
      redirect: false,
    });
  },

  async register(email: string, password: string, firstName: string, lastName: string, phoneNumber: string, birthDate: string) {
    try {
      const data = await ApiClient.post('/auth/signup', { email, password, firstName, lastName, phoneNumber, birthDate });
      
      return data;
    } catch (error) {  
      throw error;
    }
  },

  async logout() {
  try {
    await ApiClient.post('/auth/signout');

    } catch (error) {
      // Optionally handle/log error, but proceed to signOut anyway
      throw error;
    }
    return await signOut({ redirect: false });
  },

  async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const response = await ApiClient.post('/account/reset-password', { email, token, newPassword });
    
      return response;
    } catch (error) {
      throw error;
    }
  }
};