import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import https from 'https';
import { TResponse } from './response';

function getCsrfTokenSync(): string | null {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    
    return match ? decodeURIComponent(match[1]) : null;
  }
  
  return null;
}

export const ApiClient = {
  async request<T = TResponse>(url: string, config: AxiosRequestConfig = {}) {
    const session = await getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
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

    // Build final URL safely (env already has /api)
    const rawBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    let path = url.startsWith('/') ? url : `/${url}`;
    // remove duplicate /api prefix in path if base already ends with /api
    if (/\/api$/i.test(rawBase) && path.toLowerCase().startsWith('/api/')) {
      path = path.substring(4); // remove leading /api
    }
    const finalUrl = rawBase + path;

    try {
      const response = await axios({
        url: finalUrl,
        withCredentials: true,
        method: config.method || 'get',
        data: config.data,
        params: config.params,
        headers,
        httpsAgent: agent,
        responseType: config.responseType,
      });

      if (path === '/auth/signin') {
        return response as T; // need headers
      }
      return response.data as T;
    } catch (error: any) {
      if (typeof window === 'undefined') {
        throw error;
      }
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      if (error.response?.status === 403 && typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      throw error;
    }
  },

  get<T = TResponse>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'get' });
  },

  post<T = TResponse>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'post', data });
  },

  put<T = TResponse>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'put', data });
  },

  delete<T = TResponse>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(url, { ...config, method: 'delete' });
  },
};