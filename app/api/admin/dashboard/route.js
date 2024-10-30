import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { User } from "@/models/user";
import { connectToDB } from "@/utils/connectToDB";
import isAuthenticated from "@/utils/isAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  
  try {

    if (isAuthenticated(req) !== true) {
      const authResult = isAuthenticated(req);
  
      if (authResult instanceof NextResponse) {
        return authResult;
      }
    }

    await connectToDB();

    const [groupsCount, usersCounts, totalChatsCount, totalMessagesCount] =
      await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Chat.countDocuments(),
        Message.countDocuments(),
      ]);
    const stats = {
      groupsCount,
      usersCounts,
      totalChatsCount,
      totalMessagesCount,
      totalsingleChatcount: totalChatsCount - groupsCount,
    };

    const today = new Date();
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7); // this is the last 7 days means 7 days before from now

    const last7daysMessages = await Message.find({
      createdAt: {
        $gte: last7days, // this query means bring the messages 7 days from now and gte means greater that equal to
        $lte: today, // this lte means less than equal to
      },
    });
    
    const messages = new Array(7).fill(0); // this method will create an array of length 7 and fill method will fill 0 as elements
    console.log(last7daysMessages);
    
    const dayInMilliseconds = 1000 * 60 * 60 * 24;

    last7daysMessages.forEach((message) => {
      // basically is forEach loop me hum check kar rahe hai ki uss date me in 7 dino ke ander wale date me kitne message kiye gate the in that perticular date
      const IndexApprox =
        (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds;
      const index = Math.floor(IndexApprox); // it gives the exact date of the message
      messages[6 - index]++; // this means ki agr 4 din pehle ko ki gayi messages that is [sun,mon,tue,wed,thus,fri,sat] = 0 - 6 idx and 4 din pehle means 6 - 4 that is 2 i.e tuesday me ki gayi messages ki count ko increase kar do
    });

    return NextResponse.json({
      success: true,
      stats,
      messageChart: messages,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// db.messages.insert([{content: 'Message 1 in John Doe & Jane Doe chat',sender: ObjectId('66e992cd74a6e06b5cd14a0f'),chat:ObjectId('66ffd8da6ba9d6e742d14a0e'),attachments: [{public_id: 'attachment1',url: 'https://picsum.photos/200/300?random=578'}]},{content: 'Message 1 in John Doe & Jane Doe chat',sender: ObjectId('66e992cd74a6e06b5cd14a0f'),chat: ObjectId('66ffd8da6ba9d6e742d14a0e'),attachments: [{public_id: 'attachment1',url: 'https://picsum.photos/200/300?random=578'}]},])