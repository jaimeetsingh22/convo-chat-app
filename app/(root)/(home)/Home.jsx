'use client'
import { Box, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'

const Home = () => {
  return (
    <>
      <Box height={'calc(100vh - 4rem)'} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <Typography variant='h5' color={"black"}>Select any Friend to Chat</Typography>
      </Box>
    </>

  )
}

export default Home