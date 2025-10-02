import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import { ApiClient } from "../../../api-client";
import { error } from "console";

async function getCsrfToken()  {
  const cookieStore = await cookies();
  let csrf =  cookieStore.get("XSRF-TOKEN")?.value || null;
 
  if (!csrf) {
    // Fallback to fetching CSRF token from the API if not found in cookies
    await ApiClient.get<any>("/csrf");
    csrf =  cookieStore.get("XSRF-TOKEN")?.value || null;
  }
 
  return csrf;
}
 
async function refreshAccessToken(token: JWT) {
  try {
    const csrfToken = await getCsrfToken();
    console.log("Refreshing access token..., CSRF Token:", csrfToken);

    const responseRaw = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-session`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
      "Cookie": (await cookies()).toString() || "",
      },
      credentials: "include"
    });

    console.log("Refresh token response:", responseRaw);

    const response = await responseRaw.json();

    const setCookieHeader: string[] = responseRaw.headers.getSetCookie() || [];
    // Filter for valid refreshToken cookies (not expired)
    const validRefreshTokenCookies = setCookieHeader
      .filter(cookie => cookie.startsWith("refreshToken="))
      .filter(cookie => {
        const expiresMatch = cookie.match(/expires=([^;]+)/i);
        if (!expiresMatch) return true;
        const expiresDate = new Date(expiresMatch[1]);
        return expiresDate > new Date();
      });

    // Use the last valid refreshToken cookie (usually the newest one)
    const refreshTokenCookie = validRefreshTokenCookies.length > 0
      ? validRefreshTokenCookies[validRefreshTokenCookies.length - 1]
      : undefined;


    if (refreshTokenCookie) {
      // Split cookie string into parts
      const parts = refreshTokenCookie.split(";").map(part => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split("=");

      // Extract attributes
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

    //find rememberMe cookie and re-set it
    const rememberMeCookie = (await cookies()).get('rememberMe');

    if (rememberMeCookie) {
        (await cookies()).set('rememberMe', rememberMeCookie.value, {
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          path: '/'
        });
      }
    }


    if (!response.success){
      return {
        ...token,
        error: "Error refreshing access token"
      };
    };

    return {
      ...token,
      accessToken: response.data.token,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // Convert seconds to milliseconds
      user: {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token: response.data.token,
        roles: response.data.roles
      },
      error: response.success ? undefined : "No session on this device"
    };
  }
  catch (error: unknown) {

    return {
      ...token,
      error: `Error refreshing access token: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
 
const handler = NextAuth({

  secret: process.env.NEXTAUTH_SECRET,

  // Add explicit JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 1000, // 1 hour
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    CredentialsProvider({
      name: "Credentials",
 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
     
      async authorize(credentials) {
        try {
          const csrfToken = await getCsrfToken();
          // Normalize credentials payload for backend expectations
          const rememberRaw: any = credentials?.rememberMe;
          const rememberBool = rememberRaw === true || rememberRaw === 'true' || rememberRaw === 'on';
          const payload: Record<string, any> = {
            email: credentials?.email ?? '',
            password: credentials?.password ?? '',
          };
          
          if (rememberBool) payload.rememberMe = true; // only include if true

          const response = await ApiClient.post<any>("/auth/signin", payload, {
            headers: {
              ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
              "Cookie": (await cookies()).toString() || "",
            },
          });

          // Parse the refreshToken cookie from the Set-Cookie header
            const setCookieHeader: string[] = response.headers["set-cookie"] || [];
            const refreshTokenCookie = setCookieHeader.find(cookie => cookie.startsWith("refreshToken="));
           
            if (refreshTokenCookie) {
              // Split cookie string into parts
              const parts = refreshTokenCookie.split(";").map(part => part.trim());
              const [nameValue, ...attributes] = parts;
              const [name, value] = nameValue.split("=");
 
              // Extract attributes
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

              (await cookies()).set('rememberMe', rememberBool ? 'true' : 'false', {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                path: '/'
              });
            }
 
          const data = response.data;
          if (!data.success && data.errors) {
            throw error();
          }
 
          if (data.success && data.data)
            return {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              token: data.data.token,
              roles: data.data.roles
            };
 
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
  ],
 
  callbacks: {
    async jwt({ token, user, account }) {
      // Handle Google OAuth tokens

      if (account && account.provider === 'google') {
        try {

          // Exchange the Google token for your backend JWT token
          const csrfToken = await getCsrfToken();
          
          const responseRaw = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": csrfToken || "",
              "Cookie": (await cookies()).toString() || "",
            },
            credentials: "include",
            body: JSON.stringify({
              idToken: account.id_token,
              accessToken: account.access_token
            }),
          });

        const response = await responseRaw.json();
          
          // Handle the refreshToken cookie from response
          const setCookieHeader: string[] = responseRaw.headers.getSetCookie() || [];
          const validRefreshTokenCookies = setCookieHeader
            .filter(cookie => cookie.startsWith("refreshToken="))
            .filter(cookie => {
              const expiresMatch = cookie.match(/expires=([^;]+)/i);
              if (!expiresMatch) return true;
              const expiresDate = new Date(expiresMatch[1]);
              return expiresDate > new Date();
            });

          const refreshTokenCookie = validRefreshTokenCookies.length > 0
            ? validRefreshTokenCookies[validRefreshTokenCookies.length - 1]
            : undefined;

          if (refreshTokenCookie) {
            const parts = refreshTokenCookie.split(";").map(part => part.trim());
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

            (await cookies()).set('rememberMe', 'true', {
              httpOnly: false,
              secure: false,
              sameSite: 'lax',
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              path: '/'
            });
          }

          if (response.success && response.data) {
            return {
              ...token,
              accessToken: response.data.token,
              accessTokenExpires: Date.now() + 60 * 60 * 1000,
              user: {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                roles: response.data.roles
              }
            };
          }
        } catch (error) {
          console.error("Google authentication error:", error);
        }
      }
      
      // Continue with your existing JWT handling for credential login
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
          }
        };
      }

      // If the token is still valid, return it
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires)
        return token;
      
      return refreshAccessToken(token);
    },
 
    async session({ session, token }) {

      session.accessToken = token.accessToken;
      session.user = token.user;
      session.error = token.error;

      if(session.error === "No session on this device") {
        sessionStorage.clear();

        (await cookies()).delete('refreshToken');
        (await cookies()).delete('rememberMe');
      }

      return session;
    },

    // Add this callback to handle the signin process
    async signIn({ user, account, profile }) {
      if (account && account.provider === 'google') {
        return true;
      }
      return true;
    },
  },
 
  events: {

    async signOut({ token }) {
      try {
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        
        if (refreshToken) {

          await ApiClient.post("/auth/signout", {}, {
            headers: {
              "Authorization": `Bearer ${token.accessToken}`
            },
          });
        }

        (await cookies()).delete('refreshToken');
        (await cookies()).delete('rememberMe');

        sessionStorage.clear();

       
      } catch (error) {
        console.error("Sign out error:", error);
      }
    }
  },
 
  pages: {
    signIn: '/signin',
    error: '/error'
  },
 
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour (match your refresh token expiry)
    updateAge: 60 * 60 * 1000, // 1 hour
  },
 
  debug: process.env.NODE_ENV === "development",
});
 
export { handler as GET, handler as POST };