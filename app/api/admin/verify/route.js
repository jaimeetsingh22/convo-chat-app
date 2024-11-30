import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { secreteKey } = await req.json();

    if (!secreteKey) {
      return NextResponse.json(
        { message: "please enter Secrete Key" },
        {
          status: 400,
        }
      );
    }
    

    const adminSecreteKey = process.env.ADMIN_SECRETE_KEY || ".adgjmptw";

    // Verify if the secret key matches
    const isMatch = secreteKey === adminSecreteKey;
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin Secret key",
        },
        { status: 401 }
      );
    }

    // Generate a JWT for the admin user
    const token = jwt.sign(secreteKey, process.env.JWT_SECRETE);

    // Set the token as a cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Admin verified successfully",
      },
      { status: 200 }
    );

    // Setting a secure cookie with HttpOnly and max age 20 minutes (1200 seconds)
    response.cookies.set("convo-admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 5 minutes
      path: "/", // Cookie accessible on all routes
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify admin",
      },
      { status: 500 }
    );
  }
}
