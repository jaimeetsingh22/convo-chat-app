import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import isAuthenticated from "@/utils/isAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (isAuthenticated(req) !== true) {
    const authResult = isAuthenticated(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }
  try {
    await connectToDB();
    const users = await User.find({});
    const transformedUsers = await Promise.all(
      users.map(async ({ _id, name, username, avatar }) => {
        const [groups, friends] = await Promise.all([
          Chat.countDocuments({ groupChat: true, members: _id }),
          Chat.countDocuments({ groupChat: false, members: _id }),
        ]);
        return {
          _id,
          name,
          username,
          avatar: avatar.url,
          groups: groups,
          friends: friends,
        };
      })
    );
    return NextResponse.json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
