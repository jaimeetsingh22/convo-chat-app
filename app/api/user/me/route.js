import { auth } from "@/auth";
import { NextResponse } from "next/server";


export const GET = async (req) => {

  const session = await auth();
  const user = session?.user;
  if(!user){
    // const url = new URL('/login', req.url);
    return NextResponse.json({message:"You need to Login First"});
  }
  
    return NextResponse.json({user:user});
  }
  
  