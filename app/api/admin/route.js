import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookie = req.cookies.get("convo-admin-token");
  if (!cookie) {
    return NextResponse.json({ message: "Unauthorized", admin: false, }, { status: 401 });
  }
  const token = req.cookies.get("convo-admin-token").value; // Or use the auth token based on your app's implementation
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized, please log in", admin: false, },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const isMatch = decoded === process.env.ADMIN_SECRETE_KEY || ".adgjmptw";
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Not autheriged admin",
          admin: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        admin: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Not autheriged admin",

        error: error.message,
        admin: false,
      },
      { status: 401 }
    );
  }
}
