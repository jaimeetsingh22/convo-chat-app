import { NextResponse } from "next/server";

export const GET = async ()=>{
    return NextResponse.json({success: "Api Ready to Work!",
        message: "welcome to Convo!"
    });
}