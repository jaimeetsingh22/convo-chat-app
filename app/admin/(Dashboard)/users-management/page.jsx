import dynamic from 'next/dynamic';
import React from 'react'
const UserManagment = dynamic(() => import('./UserManagment'), { ssr: false })
const page = () => {
  return (
    <UserManagment />
  )
}

export default page;

export const metadata = {
  title: "Users Mangement",
  description: "Managing the users chats",
}