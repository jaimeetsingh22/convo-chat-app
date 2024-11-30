import { auth } from "@/auth";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
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


    const myId = user.id;

    const query = req.nextUrl.searchParams;
    // finding all my chats
    const myChats = await Chat.find({ groupChat: false, members: myId });
    const name = query.get("name") || "";
    // const allUsersFromMyChats = myChats.map((chat)=>chat.members) // without .flat() method

    // const allUsersFromMyChats = myChats.map((chat)=>chat.members).flat(); // with .flat() method

    // Extracting all users from my chat or my friends or i am chatted with
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members); // using flatMap()
    // console.log(name);
    // finding all users except me and my friends
    const allUsersExceptMeAndMyFriends = await User.find({
      _id: { $nin: allUsersFromMyChats }, // this will find those in which these ids provided, not present
      name: { $regex: name, $options: "i" },
      //regex and options mongodb method do following things
      //regex: name this will find the name matching words of the names in mongodb and will give the result which matches to the databases
      //options: i this will make search case insensitive
    });

    // modifying Response
    const users = allUsersExceptMeAndMyFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return NextResponse.json({ message: "hello from search", users });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      error.message = `invalid Format of ${error.path}`;
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
};
