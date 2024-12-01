import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";


export default async function authMiddleware(req) {
  try {
    const token = req.cookies.get("authjs.session-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verify JWT token
    const decoded = await decode({
        token: nextAuthToken,
        salt: "authjs.session-token",
        secret: process.env.AUTH_SECRET,
      })
    req.user = decoded; // Attach the decoded user to the request if needed

    return NextResponse.next(); // Continue to the route
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/api/(.*)"], // Apply middleware only to these routes
};
export { auth as middleware } from "@/auth";

