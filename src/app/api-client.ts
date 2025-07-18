import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import https from 'https';

function getCsrfTokenSync(): string | null {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    
    return match ? decodeURIComponent(match[1]) : null;
  }
  
  return null;
}

export const ApiClient = {
  async request<T = any>(url: string, config: AxiosRequestConfig = {}) {
    const session = await getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...Object.fromEntries(
        Object.entries(config.headers ?? {}).filter(
          ([, value]) => typeof value === 'string' && value !== null
        ) as [string, string][]
      ),
    };

    if (session?.accessToken) headers['Authorization'] = `Bearer ${session.accessToken}`;

    // Add CSRF token for mutating requests
    if (['post', 'put', 'patch', 'delete'].includes((config.method || 'get').toLowerCase())) {
      const csrfToken = getCsrfTokenSync();
      
      if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;
    }

    const agent = new https.Agent({
      rejectUnauthorized: false // for self-signed, not for production!
    });

    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        withCredentials: true, // This ensures cookies are sent
        ...config,
        headers,
        httpsAgent: agent
      });

      if(url === "/auth/signin") {
        return response as T;
      }

      return response.data as T;
    } catch (error: any) {

      if (error.response?.status === 401 && typeof window !== "undefined") {
        window.location.href = '/signin';
      }
      
      if (error.response?.status === 403 && typeof window !== "undefined") {
        window.location.href = '/unauthorized';
      }
      
      throw error;
    }
  },

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'get' });
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'post', data });
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'put', data });
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'delete' });
  },
};