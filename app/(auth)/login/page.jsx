import React from 'react'
import Login from './Login'
import { Container } from '@mui/material'


const page = () => {
  return (
    <>
      <div style={{
        background: "grey",
      }}>
        <Login />
      </div>
    </>
  )
}

export const metadata = {
  title: "Login",
  description: "Login page",
}

export default page