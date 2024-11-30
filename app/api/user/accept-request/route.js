import { auth } from "@/auth";
import { REFETCH_CHATS } from "@/constants/events";
import { Chat } from "@/models/chat";
import { Request } from "@/models/request";
import { emitEvent } from "@/utils/feature";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "You need to Login first" },
        { status: 401 }
      );
    }


    const myId = user.id;

    const { requestId, accept } = await req.json();

    // Collecting validation errors
    const errors = [];

    if (!requestId) {
      errors.push({ field: "requestId", message: "Request ID is required" });
    }

    // Handle case where accept is sent as a string
    // const parsedAccept = accept === "true" ? true : accept === "false" ? false : accept;// this is terniary this is applied when the data is sent as string 

    if (typeof accept === 'undefined') {
      errors.push({ field: "accept", message: "Accept field is required" });
    } else if (typeof accept !== "boolean") {
      errors.push({ field: "accept", message: "Accept must be a boolean value" });
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    if (request.receiver._id.toString() !== myId.toString()) {
      return NextResponse.json(
        { message: "You are not the receiver of this request" },
        { status: 403 }
      );
    }

    if (!accept) {
      await request.deleteOne();
      return NextResponse.json(
        { success: true, message: "Friend Request rejected!" },
        { status: 200 }
      );
    }

    const members = [request.receiver._id, request.sender._id];
    await Promise.all([
      Chat.create({
        members,
        name: `${request.receiver?.name} and ${request.sender?.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return NextResponse.json(
      {
        success: true,
        message: "Request accepted",
        senderId: request.sender._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { errorMessage: "Error, check logs", errors: error },
      { status: 500 }
    );
  }
}
