// middleware.tsx
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // The middleware function itself
  function middleware(req) {
    // You can leave this empty or add custom logic
  },
  {
    callbacks: {
      // If this returns true, the user is allowed to pass
      // !!token converts the token to a boolean (exists = true)
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { 
  matcher: [
    "/qreg/:path*", 
    "/add-sightseeings/:path*",
    "/sightseeing-dashboard/:path*"
  ] 
};