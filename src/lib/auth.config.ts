import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Configured dynamically in auth.ts
  session: { 
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,      // 7 days
    updateAge: 24 * 60 * 60,        // Rotate token every 24 hours
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.authorId = (token.authorId as string) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
