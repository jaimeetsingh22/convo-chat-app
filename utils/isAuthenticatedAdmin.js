import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function isAuthenticated(req) {
  const cookie = req.cookies.get("convo-admin-token");
  if (!cookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = req.cookies.get("convo-admin-token").value; // Or use the auth token based on your app's implementation
  // console.log(token)
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized, please log in" },
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
        },
        { status: 401 }
      );
    }

    return true;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Not autheriged admin",
        error: error.message,
      },
      { status: 401 }
    );
  }
}

export default isAuthenticated;
