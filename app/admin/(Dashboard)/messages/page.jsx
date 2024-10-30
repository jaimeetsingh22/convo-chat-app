import dynamic from 'next/dynamic';
import React from 'react'
const Messages = dynamic(()=>import('./Messages'),{ssr:false})

const page = () => {
  return (
    <Messages />
  )
}

export default page;

export const metadata = {
  title: "Messages",
  description: "Managing the messages",
}