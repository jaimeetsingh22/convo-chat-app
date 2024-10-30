import { auth } from "@/auth";
import { Chat } from "@/models/chat";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "You need to Login First to access this" },
        { status: 401 }
      );
    }

    const myId = user?.id;
    await connectToDB();

    const chats = await Chat.find({
      members: myId,
      groupChat: true,
      creator: myId,
    }).populate("members", "name avatar");

    const groups = chats.map(({ members, id, groupChat, name }) => ({
      id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error });
  }
}
