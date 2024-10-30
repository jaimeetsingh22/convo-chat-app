import { NextResponse } from "next/server";

export async function GET(req) {
  try {

    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successfully",
      },
      { status: 200 }
    );

    // Setting a secure cookie with HttpOnly and max age 20 minutes (1200 seconds)
    response.cookies.set("convo-admin-token", "", {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      maxAge: 0, // 20 minutes
      path: "/", // Cookie accessible on all routes
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout",
      },
      { status: 500 }
    );
  }
}
