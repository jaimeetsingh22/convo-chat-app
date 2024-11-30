import { auth } from "@/auth";
import { Chat } from "@/models/chat";
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

    const chats = await Chat.find({ members: myId }).populate(
      "members",
      "name avatar"
    );

    const transformedChats = chats.map(({ id, name, members, groupChat }) => {
      const otherMember = members.find(
        (member) => member.id.toString() !== myId.toString()
      );
      return {
        id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev, curr) => {
          if (curr.id.toString() !== myId.toString()) {
            prev.push(curr.id);
          }
          return prev;
        }, []),
      };
    });

    return NextResponse.json(
      { success: true, chats: transformedChats },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error });
  }
}
