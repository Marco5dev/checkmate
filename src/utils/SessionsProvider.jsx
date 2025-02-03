'use client';

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children, session }) {
  return <SessionProvider session={session} refetchInterval={0}>{children}</SessionProvider>;
}