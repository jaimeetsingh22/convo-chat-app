import React from 'react'
import Login from './Login'
import { Container } from '@mui/material'


const page = () => {
  return (
    <>
      <div style={{
        background: "url(https://media.tenor.com/EYo8uUHePR0AAAAi/borboletas-butterflies.gif)",
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