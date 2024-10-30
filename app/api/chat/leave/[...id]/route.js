import { auth } from "@/auth";
import { ALERT } from "@/constants/events";
import { emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export const DELETE = async (req, { params }) => {
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

    // const url = req.url.split("/");
    // const chatId = url[url.length - 1];
    const chatId = params["id"][0];
    // console.log(params["id"][0])
    if (!chatId) {
      return NextResponse.json(
        { message: "Invalid chat id or please enter chatId" },
        { status: 400 }
      );
    }
    console.log(chatId);
    await connectToDB();
    const myId = user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    if (!chat.groupChat) {
      return NextResponse.json(
        { message: "This is a private chat" },
        { status: 400 }
      );
    }

    const remainingMember = chat.members.filter(
      (member) => member.toString() !== myId.toString()
    );
    if (chat.creator.toString() === myId.toString()) {
      const randomElement = Math.floor(Math.random() * remainingMember.length);
      const newCreator = remainingMember[randomElement];
      chat.creator = newCreator;
    }
    chat.members = remainingMember;

    const me = await User.findById(myId, "name");
    await chat.save();
    console.log(me.name);
    emitEvent(req, ALERT, chat.members, `${me.name} has left the group`);

    return NextResponse.json(
      { message: "Chat leaved Successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
