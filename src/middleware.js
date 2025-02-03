import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Modify response headers if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // If there's no token, user is not logged in
        if (!token) {
          return false;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Add routes that require authentication
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    // Add more protected routes as needed
    // Exclude auth routes
    "/((?!api|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
