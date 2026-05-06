import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "psyconnect-admin-2026";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // Check if email is in admin list
        const isAdminEmail =
          ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(email);
        const isValidPassword = password === ADMIN_PASSWORD;

        if (isAdminEmail && isValidPassword) {
          return {
            id: email,
            name: "Admin",
            email,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) return true;
      if (isAdminRoute) return isLoggedIn;
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "psyconnect-dev-secret-change-in-production",
});
