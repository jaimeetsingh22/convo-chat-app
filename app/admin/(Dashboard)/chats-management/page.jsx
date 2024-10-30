import dynamic from 'next/dynamic';
import React from 'react'
const ChatManagment = dynamic(()=>import('./ChatManagment'),{ssr:false});
const page = () => {
  return (
    <ChatManagment />
  )
}

export default page;

export const metadata = {
  title: "Chats-Management",
  description: "Managing the Chats",
}