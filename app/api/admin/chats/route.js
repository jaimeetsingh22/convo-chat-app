import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import isAuthenticated from "@/utils/isAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  // a common error getting in the admin api i will handle it later
  //  "error": "Schema hasn't been registered for model \"User\".\nUse mongoose.model(name, schema)"
  // this is solved by adding the code import { User } from "@/models/user"; because this user model should be registered before used because the chat model use the user model of to find the user data so that is why it is used so that it registered before hitting it

  if (isAuthenticated(req) !== true) {
    const authResult = isAuthenticated(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }
  try {
    
    const chats = await Chat.find({})
      .populate("members", "name avatar")
      .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
      chats.map(async ({ _id, name, groupChat, members, creator }) => {
        const totalMessagesCount = await Message.countDocuments({ chat: _id });
        return {
          _id,
          name,
          groupChat,
          avatar: members.slice(0, 3).map((member) => member.avatar.url),
          members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar?.url,
          })),
          creator: {
            name: creator?.name || "None",
            avatar: creator?.avatar?.url || "",
          },
          totalMembers: members.length,
          totalMessagesCount: totalMessagesCount || 0,
        };
      })
    );
    return NextResponse.json({
      success: true,
      chats: transformedChats,
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
