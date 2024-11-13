import AlternateChatsLoading from '@/components/LoadingsComponent/AlternateChatsLoading';
import dynamic from 'next/dynamic';
import React from 'react'
// import Chat from './Chat'
const Chat = dynamic(() => import('@/app/(root)/(home)/chat/[chatId]/Chat'), {
  loading: () => <AlternateChatsLoading />,
  ssr: false
});


const page = () => {
  // console.log(params);
  return (
    <Chat />
  )
}

export const metadata = {
  title: "Chats",
  description: "chat page",
}

export default page