import { auth } from "@/auth";
import { ALERT } from "@/constants/events";
import { emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
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
    const { name, members } = await req.json();

    // Validation errors array
    const errors = [];

    // Check if group name is provided
    if (!name) {
      errors.push({
        field: "name",
        message: "Please enter the name of the group",
      });
    }

    // Check if members array is provided and its length
    if (!members || members.length === 0) {
      errors.push({ field: "members", message: "Please enter members" });
    } else if (members.length < 2 || members.length > 200) {
      errors.push({
        field: "members",
        message: "Members must be between 2 and 200",
      });
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    await connectToDB();

    const existingGroup = await Chat.findOne({ name });
    if (existingGroup) {
      return NextResponse.json(
        { message: "Same Name Group already exists" },
        { status: 400 }
      );
    }

    const allMembers = [...members, myId];

    await Chat.create({
      name,
      groupChat: true,
      creator: myId,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);

    return NextResponse.json(
      { success: true, message: "Group created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
};
