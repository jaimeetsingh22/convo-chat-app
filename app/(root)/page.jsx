
import React from 'react'
// import Home from './Home'
import dynamic from 'next/dynamic'

const Home = dynamic(()=>import('./Home'),{ssr: false});


const page = () => {
  

  // getData();
  return (
    <Home/>
  )
}

export const metadata = {
  title: "Convo! Chatt",
  description: "A New Chatting app Convo",
}

export default page