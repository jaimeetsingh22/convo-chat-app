import { auth } from "@/auth";
import { NEW_ATTACHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT } from "@/constants/events";
import { emitEvent } from "@/utils/feature";
import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { uploadFilesToCloudinary } from "@/utils/cloudinaryWork";

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
    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(myId, "name"),
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
      // revalidatePath('') // This function allows you to purge cached data on-demand for a specific path.
      // means the above revalidatePath functions will refresh the cashed data on-demand for a specific path i will use it later
    }
    console.log("file buffer array: ",datas);
    
    // console.log(buffer);
    if (files.length < 1) {
      return NextResponse.json(
        { message: "Please Provide attachments" },
        { status: 400 }
      );
    }
    
    // upload files here // cloudinary work!
    const attachments = await uploadFilesToCloudinary(datas);
    console.log("attachments results: ",attachments);
    const messageForDB = {
      content: "",
      attachments,
      sender: me._id,
      chat: chatId,
    };
    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
      },
    };

    const message = await Message.create(messageForDB);

    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });
    emitEvent(req, NEW_MESSAGE_ALERT, { chatId });

    return NextResponse.json({
      success: true,
      message,
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
