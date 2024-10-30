import { Message } from "@/models/message";
import { connectToDB } from "@/utils/connectToDB";
import isAuthenticated from "@/utils/isAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (isAuthenticated(req) !== true) {
    const authResult = isAuthenticated(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }  try {
    await connectToDB();

    const messages = await Message.find({})
      .populate("sender", "name avatar")
      .populate("chat", "goupChat");

    const transformedMessages = messages.map(
      ({ content, attachments, _id, sender, chat, createdAt }) => ({
        _id,
        content,
        attachments,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar.url,
        },
      })
    );
    return NextResponse.json({
      success: true,
      chats: transformedMessages,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
