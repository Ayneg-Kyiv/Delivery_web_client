import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
    error?: string;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    token: string;
    roles: string[];
    response?: NextResponse;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken?: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      roles: string[];
    };
    error?: string;
  }
}