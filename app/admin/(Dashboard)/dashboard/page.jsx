import dynamic from 'next/dynamic'
import React from 'react'
const Dashboard = dynamic(()=>import('./Dashboard'),{ssr:false});
const page = () => {
  return (
    <Dashboard />
  )
}

export const metadata = {
  title: "Dashboard",
  description: "Admin dashboard",
}

export default page;