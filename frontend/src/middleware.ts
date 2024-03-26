import { authMiddleware } from "@clerk/nextjs";
import { NextResponse} from "next/server";

export default authMiddleware({
  publicRoutes:["/sign-in","/sign-up","/", "/api/(.*)"],
  debug:false,
  afterAuth(auth, req) {
    
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const url = req.nextUrl.clone()
      url.pathname = '/sign-in'    
      return NextResponse.redirect(url)
    }

    // handle authenticated user away from /sign-in & /sign-up paths
    if(auth && auth.userId && !req.nextUrl.pathname.includes('getting-start') &&  (req.nextUrl.pathname.includes('sign-in') || req.nextUrl.pathname.includes('sign-up'))){
      const url = req.nextUrl.clone()
      url.pathname = '/getting-start'    
      return NextResponse.redirect(url);
    }

    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
