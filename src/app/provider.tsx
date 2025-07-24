'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { ApiClient } from "./api-client";

type AuthProviderProps = {
  children: ReactNode;
  session?: any;
};

export function AuthProvider({ children, session }: AuthProviderProps) {

  useEffect(() => {
  }, []);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}