import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import https from 'https';
import axios from 'axios';

// Create HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await axios.post('https://localhost:7051/api/auth/refresh-session', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      httpsAgent
    });

    const data = response.data;

    if (!data.success) {
      return {
        ...token,
        error: "Error refreshing access token"
      };
    }

    return {
      ...token,
      accessToken: data.data.token,
      accessTokenExpires: Date.now() + 1 * 60 * 60 * 1000, // Convert to milliseconds
      user: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        roles: data.data.roles
      }
    };
  }
  catch (error) {
    return {
      ...token,
      error: "Error refreshing access token"
    };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials) {
        try {
          const response = await axios.post('https://localhost:7051/api/auth/callback/credentials', {
            email: credentials?.email,
            password: credentials?.password
          }, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            httpsAgent
          });
          
          if (response.status === 200) {
            const data = response.data;
            
            // Parse cookies from response headers
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
              // Handle refresh token cookie if needed
              const refreshTokenCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('refreshToken='));
              if (refreshTokenCookie) {
                const refreshTokenMatch = refreshTokenCookie.match(/refreshToken=([^;]+)/);
                if (refreshTokenMatch) {
                  (await cookies()).set('refreshToken', refreshTokenMatch[1], {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                  });
                }
              }
            }
            
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              token: data.user.token,
              roles: data.user.roles
            };
          }
          
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If user is provided, it means this is the first time the JWT is being created
        // Store user information and access token in the JWT
        return {
          ...token,
          accessToken: user.token,
          accessTokenExpires: Date.now() + 1 * 60 * 60,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
          }
        };
      }
        // If the token already has an access token and it hasn't expired, return it
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.error = token.error;
      
      return session;
    }
  },

  events: {
    async signOut({ token }) {
      try {
        await axios.post('https://localhost:7051/api/auth/signout', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}`
          },
          httpsAgent
        });

        // Clear session storage on client side (this runs server-side, so might not work)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("next-auth.session-token");
          sessionStorage.removeItem("next-auth.csrf-token"); 
          sessionStorage.removeItem("next-auth.callback-url");
        }
        
      } catch (error) {
        console.error("Sign out error:", error);
      }
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },

  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour (match your refresh token expiry)
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };