import { auth } from "@/auth";
import { NEW_REQUEST } from "@/constants/events";
import { Request } from "@/models/request";
import { connectToDB } from "@/utils/connectToDB";
import { emitEvent } from "@/utils/feature";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      // const url = new URL('/login', req.url);
      return NextResponse.json(
        { message: "you need to Login first" },
        { status: 401 }
      );
    }

    await connectToDB();
    const myId = user.id;

    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const request = await Request.findOne({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    });

    if (request) {
      return NextResponse.json(
        { message: "Request already Sent" },
        { status: 400 }
      );
    }

    await Request.create({
      sender: myId,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return NextResponse.json({ success: true, message: "Friend Request Sent" });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { errorMessage: "error check logs", errors: error },
      { status: 500 }
    );
  }
}
