import { auth } from "@/auth";
import { ALERT, REFETCH_CHATS } from "@/constants/events";
import { emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export const DELETE = async (req, res) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      // const url = new URL("/login", req.url);
      return NextResponse.json(
        { message: "You need to Login First to access this" },
        { status: 401 }
      );
    }

    await connectToDB();
    const myId = user.id;
    const { userId, chatId } = await req.json();
    console.log(userId, chatId);

    const [chat, userThatWillRemove] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]).catch((error) => console.log(error));

    // const chat = results[0];
    // const userThatWillRemove = results[1];

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    if (!chat.groupChat) {
      return NextResponse.json(
        { message: "This is not a group chat" },
        { status: 400 }
      );
    }

    if (chat.creator.toString() !== myId.toString())
      return NextResponse.json(
        { message: "You are Not allowed to remove member" },
        { status: 403 }
      );

    if (chat.members.length <= 3)
      return NextResponse.json(
        {
          message:
            "You can't remove members from a group chat with less than 4 members",
        },
        { status: 400 }
      );

    const allChatMembers = chat?.members.map((i) => i.toString());

    chat.members = chat?.members.filter(
      (member) => member.toString() !== userId.toString()
    );
    await chat.save();
    emitEvent(
      req,
      ALERT,
      chat.member,
      `${userThatWillRemove.name} has been removed from the group`
    );
    emitEvent(req, REFETCH_CHATS, chat.member);
    const removedMemberMemberMessage = `${userThatWillRemove.name} has been removed from the group`;
    return NextResponse.json(
      {
        success: true,
        message: "Member removed Successfully",
        removedMemberMemberMessage,
        members: allChatMembers,
        chatId
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
      { message: "error removing members", error: error.message },
      { status: 500 }
    );
  }
};
