import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse} from "next/server";

export default authMiddleware({
  publicRoutes:["/sign-in","/sign-up","/", "/api/(.*)"],
  afterAuth(auth, req) {
    
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // handle authenticated user away from /sign-in & /sign-up paths
    if(auth.userId && (req.nextUrl.pathname.includes('sign-in') || req.nextUrl.pathname.includes('sign-up'))){
      const url = req.nextUrl.clone()
      url.pathname = '/chat'    
      return NextResponse.redirect(url);
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
