import { auth } from "@/auth";
import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { uploadFilesToCloudinary } from "@/utils/cloudinaryWork";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth(); // Assuming auth is a function that checks authentication
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

    // Get chatId from the request body
    const formdata = await req.formData();
    const chatId = formdata.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { message: "ChatId is required" },
        { status: 400 }
      );
    }
    // Fetch chat and user details in parallel
    const [chat] = await Promise.all([
      Chat.findById(chatId),
    ]);

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    const files = formdata.getAll("files");

    const datas = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      datas.push(buffer);
    }

    if (files.length < 1) {
      return NextResponse.json(
        { message: "Please Provide attachments" },
        { status: 400 }
      );
    }

    // upload files here // cloudinary work!
    const attachments = await uploadFilesToCloudinary(datas);
    const messageForDB = {
      content: "",
      attachments,
      sender: myId,
      chat: chatId,
    };

    const message = await Message.create(messageForDB);

    return NextResponse.json({
      success: true,
      message,
      members: chat.members,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
