'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode , useEffect } from "react";
import { Session } from 'next-auth'
import { cookies } from "next/dist/server/request/cookies";

type AuthProviderProps = {
  children: ReactNode;
  session?: Session;
};

export function AuthProvider({ children, session }: AuthProviderProps) {

  useEffect(() => {
  }, []);

  return (
    <SessionProvider session={session} refetchInterval={1 * 60 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}