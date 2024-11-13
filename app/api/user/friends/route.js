import { auth } from "@/auth";
import { Chat } from "@/models/chat";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req) {

  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "You need to Login First to access this" },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDB();
    const myId = user.id;
    const query = req.nextUrl.searchParams;
    const chatId = query.get("chatId");

    const chats = await Chat.find({ members: myId, groupChat: false }).populate(
      "members",
      "name avatar"
    );

    const friends = chats.map(({ members }) => {
      const otherUser = members.find(
        (member) => member.id.toString() !== myId.toString()
      );

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
      return NextResponse.json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return NextResponse.json({ success: true, friends });
    }
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error fetching chat", errors: error.message },
      { status: 500 }
    );
  }
}
