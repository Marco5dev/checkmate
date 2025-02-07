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

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public access to wallpapers
        if (req?.nextUrl?.pathname.startsWith('/wallpapers/')) {
          return true;
        }
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/auth/callback/github",
    // Exclude public assets and auth routes from protection
    "/((?!api|login|register|_next/static|_next/image|favicon.ico|wallpapers).*)",
  ],
};
