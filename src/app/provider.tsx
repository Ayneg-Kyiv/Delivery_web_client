'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { ApiClient } from "./api-client";

async function fetchCsrfToken() {
  try {
    await ApiClient.get("/csrf");
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

type AuthProviderProps = {
  children: ReactNode;
  session?: any;
};

export function AuthProvider({ children, session }: AuthProviderProps) {

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}