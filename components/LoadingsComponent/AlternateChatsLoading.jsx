
import { Grid, Skeleton } from '@mui/material'
import React from 'react'

const AlternateChatsLoading = () => {
    return (
        <> <Grid container height={"calc(100vh - 4rem)"} justifyContent="center" alignItems="center" overflow="hidden">
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                height={'100%'}
            >
                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} padding="1rem">
                    {/* Simulate alternating chat bubbles (left and right) */}
                    {Array.from(new Array(10)).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            height={40}
                            width={index % 2 === 0 ? "40%" : "60%"}
                            sx={{
                                mb: 2,
                                marginLeft: index % 2 === 0 ? "0" : "auto",
                                marginRight: index % 2 === 0 ? "auto" : "0",
                                borderRadius: '1rem'
                            }}
                        />
                    ))}
                </Grid>

            </Grid>
        </Grid></>
    )
}

export default AlternateChatsLoading