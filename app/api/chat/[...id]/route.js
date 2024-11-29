// app/api/chat/[id]/route.js

import { auth } from "@/auth";
import { REFETCH_CHATS } from "@/constants/events";
import { deleteFilesFromCloudinary, emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
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

  const id = params["id"][0];
  const query = req.nextUrl.searchParams;
  const populate = query.get("populate");

  try {
    if (populate) {
      const chat = await Chat.findById(id)
        .populate("members", "name avatar")
        .lean();

      if (!chat) {
        return NextResponse.json(
          { message: "Chat Not Found!" },
          {
            status: 404,
          }
        );
      }
      chat.members = chat.members.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
      }));
      return NextResponse.json(
        {
          chat,
        },
        { status: 200 }
      );
    } else {
      const chat = await Chat.findById(id).lean();
      if (!chat) {
        return Response.json(
          { message: "Chat Not Found!" },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: true,
          chat,
        },
        { status: 200 }
      );
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

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "You need to Login First to access this" },
        { status: 401 }
      );
    }

    await connectToDB();

    const id = params["id"][0];
    console.log(id);

    return await updateChatById(req, id, user);
  } catch (error) {
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: "Error updating chat",
        errors: error.message,
      },
      {
        status: 500,
      }
    );
  }

  // Connect to the database
}

export async function DELETE(req, { params }) {
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

  const id = params["id"][0];

  try {
    return await deleteChatById(req, id, myId);
  } catch (error) {
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Failed to delete chat", errors: error.message },
      { status: 500 }
    );
  }
}

async function updateChatById(req, id, user) {
  const chatId = id;
  const myId = user["id"];
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const chat = await Chat.findById(id);
  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }
  if (!chat.groupChat) {
    return NextResponse.json(
      { error: "This is not a group chat" },
      { status: 400 }
    );
  }

  if (chat.creator.toString() !== myId.toString()) {
    return NextResponse.json(
      { error: "You are not allowed to rename this chat" },
      { status: 403 }
    );
  }

  chat.name = name;
  await chat.save();
  emitEvent(req, REFETCH_CHATS, chat.members);
  return NextResponse.json(
    { message: "Chat name updated successfully", chat: chat },
    { status: 200 }
  );
}

async function deleteChatById(req, id, myId) {
  try {
    const chatId = id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found or already deleted" },
        { status: 404 }
      );
    }

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== myId.toString()) {
      return NextResponse.json(
        { message: "you are not allowed to delete chat" },
        {
          status: 403,
        }
      );
    }

    if (!chat.groupChat && !chat.members?.includes(myId.toString())) {
      return NextResponse.json(
        { message: "you are not allowed to delete chat" },
        {
          status: 403,
        }
      );
    }

    // Here we have to delete All messages as well as attachments or files from cloudinary

    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) =>
      attachments.forEach(({ public_id }) => public_ids.push(public_id))
    );

    await Promise.all([
      // Delete files from cloudinary
      deleteFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);
    emitEvent(req, REFETCH_CHATS, members);

    return NextResponse.json(
      { success: true, message: "Chat deleted successfully", members },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting chat" },
      { status: 500 }
    );
  }
}
