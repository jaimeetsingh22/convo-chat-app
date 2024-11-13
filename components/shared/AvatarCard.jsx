import { transformImage } from '@/utils/feature'
import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'

const AvatarCard = ({ avatar = [], max = 4, top = "1rem" }) => {
    return (
        <Stack direction={'row'} spacing={'0.5'} padding={'1rem'} >
            <AvatarGroup max={max} position={'relative'}>
                <Box>
                    {avatar.map((item, index) =>{
                       return (
                        
                            <Avatar key={index} src={transformImage(item?.avatar?.url || item)} alt={item}
                                sx={{
                                    width: "3rem",
                                    height: "3rem",
                                    position: 'absolute',
                                    left: {
                                        xs: `${0.5 + index}rem`,
                                        sm: `${index}rem`
                                    },
                                    top: top,
                                }} />
                        )
                    }
                     )}
                </Box>
            </AvatarGroup>

        </Stack>
    )
}

export default AvatarCard