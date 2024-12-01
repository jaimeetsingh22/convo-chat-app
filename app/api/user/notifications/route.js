import { auth } from "@/auth";
import { Request } from "@/models/request";
import { connectToDB } from "@/utils/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      // const url = new URL('/login', req.url);
      return NextResponse.json(
        { message: "you need to Login first" },
        { status: 401 }
      );
    }

    await connectToDB();
    const myId = user.id;

    const requests = await Request.find({ receiver: myId }).populate(
      "sender",
      "name avatar"
    );

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));
    return NextResponse.json({ success: true, allRequests });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
