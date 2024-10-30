import { Grid, Skeleton } from '@mui/material'
import React from 'react'

const ChatlistSkeleton = () => {
  return (
    <>
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            bgcolor: "ButtonShadow",
            overflowY: "auto",
            padding: "1rem",
          }}
          height={"100%"}
          width={"30vw"}
        >
          {/* Simulate chat list */}
          {Array.from(new Array(10)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              width="100%"
              sx={{ mb: 2 }}
            />
          ))}
        </Grid>
    </>
  )
}

export default ChatlistSkeleton