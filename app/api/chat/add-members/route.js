import { auth } from "@/auth";
import { ALERT, REFETCH_CHATS } from "@/constants/events";
import { emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export const PUT = async (req, res) => {
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
    const { chatId, members } = await req.json();
    // console.log(chatId, members);
    if (!chatId) {
      return NextResponse.json(
        { message: "Chat ID is required" },
        { status: 400 }
      );
    }
    if (!members || members.length < 1) {
      return NextResponse.json(
        { message: "Please Provide Members" },
        { status: 404 }
      );
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    if (!chat.groupChat) {
      return NextResponse.json(
        { message: "This is not a group chat" },
        { status: 404 }
      );
    }

    if (chat.creator.toString() !== myId.toString())
      return NextResponse.json(
        { message: "You are Not allowed to do that" },
        { status: 404 }
      );

    const allMembersPromise = members.map((i) => User.findById(i, "name")); // this "name" means i.name

    const allMembers = await Promise.all(allMembersPromise); // An array of Promises. Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected. // ye basically sare promises ko resolve kar dega ek sath
    const uniquMembers = allMembers
      .filter((i) => !chat.members.includes(i._id.toString()))
      .map((i) => i._id); // this will the array of the unique members that are already not present in the array

    const existingMembers = allMembers
      .filter((i) => chat.members.includes(i._id.toString()))
      .map((i) => i.name)
      .join(", ");
    console.log(`${existingMembers} are already exist`);

    console.log(uniquMembers);

    chat.members.push(...uniquMembers);

    if (chat.members.length > 100) {
      return NextResponse.json(
        { message: "Group Members limit Reached!" },
        { status: 400 }
      );
    }

    await chat.save();

    const allUsersName = allMembers.map((i) => i.name).join(","); //Adds all the elements of an array into a string, separated by the specified separator string
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${
        existingMembers
          ? `${existingMembers} are already present in the group and ${allUsersName} are added to the group`
          : `${allUsersName} has been added in this group`
      }`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return NextResponse.json(
      {
        message: existingMembers
          ? `${existingMembers} Already Exist Rest of Members are Added`
          : "Members Added successfully!",
        members: chat.members,
        messageForAlert: `${
          existingMembers
            ? `${existingMembers} are already present in the group and ${allUsersName} are added to the group`
            : `${allUsersName} has been added in this group`
        }`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
};
