import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import { ApiClient } from "../../../api-client";

async function getCsrfToken()  {
  const cookieStore = await cookies();
  let csrf =  cookieStore.get("XSRF-TOKEN")?.value || null;

  if (!csrf) {
    // Fallback to fetching CSRF token from the API if not found in cookies
    const response = await ApiClient.get<any>("/csrf");
    csrf = response?.csrfToken || null;
  }

  return csrf;
}

async function refreshAccessToken(token: JWT) {
  try {
    const csrfToken = await getCsrfToken();
    const data = await ApiClient.post<any>("/auth/refresh-session", {}, {
      headers: {
        "X-XSRF-TOKEN": csrfToken || "",
      },
    });

    if (!data.success)
      return {
        ...token,
        error: "Error refreshing access token"
      };

    return {
      ...token,
      accessToken: data.data.token,
      accessTokenExpires: Date.now() + 1 * 60 * 60, // Convert seconds to milliseconds
      user: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        token: data.data.token,
        roles: data.data.roles
      }
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
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials) {
        try {
          const csrfToken = await getCsrfToken();

          const response = await ApiClient.post<any>("/auth/signin", credentials, {
            headers: {
              "X-XSRF-TOKEN": csrfToken || "",
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
            }

          const data = response.data;

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
        await ApiClient.post("/auth/signout", {}, {
          headers: {
            "Authorization": `Bearer ${token.accessToken}`
          },
        });

        sessionStorage.removeItem("next-auth.session-token");
        sessionStorage.removeItem("next-auth.csrf-token"); 
        sessionStorage.removeItem("next-auth.callback-url");
        
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