import { auth } from "@/auth";
import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    const user = session?.user;
    // if (!user) {
    //   return NextResponse.json(
    //     { message: "You need to Login First to access this" },
    //     { status: 401 }
    //   );
    // }

    // Connect to the database
    await connectToDB();
    const myId = user.id;

    const id = params["id"][0];
    
    const query = req.nextUrl.searchParams;
    const page = query.get("page") || 1;
    const chatId = id;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }
    if (!chat.members.includes(myId.toString())) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this chat" },
        { status: 403 }
      );
    }

    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage); // this ceil method gives the round off value of decimal numbers

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error fetching Messages Please try again", errors: error },
      { status: 500 }
    );
  }
}
