'use client'
import React, { memo } from 'react'
import { Stack } from '@mui/system'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import AvatarCard from './AvatarCard'
import { useDispatch } from 'react-redux'
import { setIsMobileMenu } from '@/redux/reducers/miscSlice'

const ChatItem = ({
    avatar = [],
    name,
    _id = 'alskdj',
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert = [],
    index = 0,
    handleDeleteChat
}) => {
    const dispatch = useDispatch()
    const handleMobileClose = () => {
        dispatch(setIsMobileMenu(false));
      }

    return (
        <Link
            style={{
                textDecoration: 'none',
                color: 'black',
                width: '100%',
                display: 'block',
            }}
            href={`/chat/${_id}`}
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
            onClick={handleMobileClose}
        >
            <div
                style={{
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    height: '5rem',
                    padding: '1rem',
                    backgroundColor: sameSender ? 'black' : 'unset',
                    color: sameSender ? 'white' : 'unset',
                    justifyContent: 'space-between',
                    gap: '0.3rem',
                    position: 'relative',
                    borderRadius: '10px 0px 10px 0px', // add rounded border
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease', // smooth transition for hover effect
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = sameSender ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.1)'} // hover effect

                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = sameSender ? 'black' : 'unset'}
            >
                <AvatarCard avatar={avatar} />
                <Stack textAlign={'center'}>
                    <Typography alignSelf={'center'}>{name}</Typography>
                    {
                        newMessageAlert && (
                            <Typography color={sameSender ? "white" : "black"}>{newMessageAlert.count} </Typography>
                        )
                    }
                </Stack>
                {
                    isOnline && <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'green',
                        justifySelf:'end'
                    }} />
                }
            </div>
        </Link>
    )
}

export default memo(ChatItem);
