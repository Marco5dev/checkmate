import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    
    // Add connecting flag to session if this is a connection attempt
    if (req.nextUrl.pathname.startsWith('/api/auth/callback/github') && token) {
      req.nextauth.token = {
        ...token,
        connecting: true
      };
    }

    // Modify response headers if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/auth/callback/github",
    "/((?!api|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
