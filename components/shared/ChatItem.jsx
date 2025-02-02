'use client'
import React, { memo } from 'react'
import { Stack } from '@mui/system'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import AvatarCard from './AvatarCard'
import { useDispatch } from 'react-redux'
import { setIsMobileMenu } from '@/redux/reducers/miscSlice'
import { motion } from "framer-motion"
import { chatItemOnHoverAtSamesenderFalse, chatItemOnHoverAtSamesenderTrue, chatItemsOnSameSenderFalse, chatItemsOnSameSenderTrue, chatItemTextOnSameSenderFalse, chatItemTextOnSameSenderTrue } from '@/constants/color'
import { setOnGoingCall } from '@/redux/reducers/chat'

const ChatItem = ({
    avatar = [],
    name,
    _id = 'alskdj',
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat
}) => {
    const dispatch = useDispatch()
    const handleMobileClose = () => {
        dispatch(setIsMobileMenu(false));
    }
    console.log()

    return (
        <Link
            style={{
                textDecoration: 'none',
                color: 'black',
                width: '100%',
                display: 'block',
            }}
            href={`/chat/${_id}?name=${name}`}
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
            onClick={()=>{
                handleMobileClose()
                dispatch(setOnGoingCall({
                    isRinging:false,
                    participants:{
                      caller:{
                        name:"",
                        avatar:"",
                        id:""
                      },
                      receiver:{
                        name,
                        avatar:avatar[0].avatar.url,
                      }
                    }
                }))
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: '-100%' }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: index * 0.2
                }}

                style={{
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: '2fr 2fr 1fr',
                    height: '5rem',
                    padding: '1rem',
                    backgroundColor: sameSender ? chatItemsOnSameSenderTrue : chatItemsOnSameSenderFalse,
                    color: sameSender ? chatItemTextOnSameSenderTrue : chatItemTextOnSameSenderFalse,
                    justifyContent: 'space-between',
                    gap: '0.3rem',
                    position: 'relative',
                    borderRadius: '10px 0px 10px 0px', // add rounded border
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease', // smooth transition for hover effect
                    borderRadius: '30px',
                    margin: '0.5rem'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = sameSender ? chatItemOnHoverAtSamesenderTrue: chatItemOnHoverAtSamesenderFalse; // Adjust hover effect
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = sameSender ? chatItemsOnSameSenderTrue : chatItemsOnSameSenderFalse; // Reset to original background
                }}
            >
                <AvatarCard avatar={avatar} />
                <Stack textAlign={'center'}>
                    <Typography alignSelf={'center'}>{name}</Typography>
                    {
                        newMessageAlert && (
                            <Typography fontSize={'0.6rem'} color={sameSender ? "white" : "black"}>{newMessageAlert.count} New Message</Typography>
                        )
                    }
                </Stack>
                {
                    isOnline && <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'green',
                        justifySelf: 'end'
                    }} />
                }
            </motion.div>
        </Link>
    )
}

export default memo(ChatItem);
