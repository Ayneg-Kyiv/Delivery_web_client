import { signIn, signOut } from 'next-auth/react';
import { apiPost } from './api-client';

export const AuthService = {
  async login(email: string, password: string, rememberMe: boolean) {
    return signIn('credentials', {
      email,
      password,
      rememberMe,
      redirect: false,
    });
  },

  async register(email: string, password: string, firstName: string, lastName: string, phoneNumber: string, birthDate: string, token?: string) {
    try {
      const data = await apiPost('/auth/signup', { email, password, firstName, lastName, phoneNumber, birthDate }, {}, token);
      
      return data;
    } catch (error) {  
      throw error;
    }
  },

  async logout() {
    return await signOut({ redirect: false });
  },

  async resetPassword(email: string, token: string, newPassword: string, accessToken?: string) {
    try {
      const response = await apiPost('/account/reset-password', { email, token, newPassword }, {}, accessToken);

      return response;
    } catch (error) {
      throw error;
    }
  }
};