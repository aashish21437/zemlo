// middleware.tsx
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // No hard redirects for /admin now
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { 
  matcher: [
    "/qreg/:path*", 
    "/add-sightseeings/:path*",
    "/sightseeing-dashboard/:path*",
    "/admin/:path*",
    "/vehicle/:path*"
  ] 
};