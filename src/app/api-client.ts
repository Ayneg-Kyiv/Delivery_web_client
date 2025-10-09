'use server';

import { encrypt } from '@/utils/aes';
import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import { cookies } from 'next/headers';

async function getCsrfTokenSync() {
  const cookieStore = await cookies();


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cookie": (await cookies()).toString() || "",
      },
    });

    console.log('CSRF fetch response headers:', response.headers);

    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
      
      const cookiesArray = setCookieHeader.match(/(?:[^\s,;][^,]*?=[^;]+(?:;[^,]*)*)/g) || [setCookieHeader];
      for (const cookieString of cookiesArray) {
        const parts = cookieString.split(";").map(part => part.trim());
        const [nameValue, ...attributes] = parts;
        const [name, value] = nameValue.split("=");

        const cookieOptions: Record<string, any> = {
          name,
          value: decodeURIComponent(value || ""),
          httpOnly: false,
          secure: false,
          sameSite: undefined,
          expires: undefined,
          path: undefined
        };

        attributes.forEach(attr => {
          if (attr.toLowerCase() === "httponly") cookieOptions.httpOnly = true;
          if (attr.toLowerCase() === "secure") cookieOptions.secure = true;
          if (attr.toLowerCase().startsWith("samesite")) cookieOptions.sameSite = attr.split("=")[1];
          if (attr.toLowerCase().startsWith("expires")) cookieOptions.expires = new Date(attr.split("=")[1]);
          if (attr.toLowerCase().startsWith("path")) cookieOptions.path = attr.split("=")[1];
        });

        (await cookies()).set(cookieOptions.name, cookieOptions.value, {
          httpOnly: cookieOptions.httpOnly,
          secure: cookieOptions.secure,
          sameSite: cookieOptions.sameSite,
          expires: cookieOptions.expires,
          path: cookieOptions.path
        });
      }
    }

    const csrf =  cookieStore.get("XSRF-TOKEN")?.value || null;
  
  return csrf;
}

export async function apiRequest<T = any>(url: string, config: AxiosRequestConfig = {}, token?: string, secure: boolean = false) {

  const csrfToken = await getCsrfTokenSync();
  console.log('CSRF Token:', csrfToken);

  const headers: Record<string, string> = {
    'Content-Type': (secure ? 'application/octet-stream' : 'application/json'),
    'Accept': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    'Cookie': (await cookies()).toString() || '',
    ...Object.fromEntries(
      Object.entries(config.headers ?? {}).filter(
        ([, value]) => typeof value === 'string' && value !== null
      ) as [string, string][]
    ),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;

  const agent = new https.Agent({
    rejectUnauthorized: false // for self-signed, not for production!
  });

  const rawBase = (process.env.NEXT_API_URL || '').replace(/\/$/, '');
  let path = url.startsWith('/') ? url : `/${url}`;
  if (/\/api$/i.test(rawBase) && path.toLowerCase().startsWith('/api/')) {
    path = path.substring(4);
  }
  const finalUrl = rawBase + path;

  if(secure) {
    var encryptedPayload = encrypt(JSON.stringify(config.data || {}));
    config.data = encryptedPayload;
  }
  
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
      return response as T;
    }
    return response.data as T;
  } catch (error: any) {
    // Server components can't redirect, just throw
    throw error;
  }
}

// Convenience methods
export async function apiGet<T = any>(url: string, config?: AxiosRequestConfig, token?: string) {
  return apiRequest<T>(url, { ...config, method: 'get' }, token);
}

export async function apiPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig, token?: string) {
  return apiRequest<T>(url, { ...config, method: 'post', data }, token);
}

export async function apiPut<T = any>(url: string, data?: any, config?: AxiosRequestConfig, token?: string) {
  return apiRequest<T>(url, { ...config, method: 'put', data }, token);
}

export async function apiDelete<T = any>(url: string, config?: AxiosRequestConfig, token?: string) {
  return apiRequest<T>(url, { ...config, method: 'delete' }, token);
}