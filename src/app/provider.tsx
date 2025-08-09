'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode , useEffect } from "react";
import { Session } from 'next-auth'

type AuthProviderProps = {
  children: ReactNode;
  session?: Session;
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