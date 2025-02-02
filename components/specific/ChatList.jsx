'use client'
import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'
import { useSelector } from 'react-redux'

const ChatList = ({
    w = '100%',
    router,
    chats = [],
    chatId,
    // onlineUsers = [],
    newMessagesAlert,
    handleDeleteChat,
}) => {
    const {onlineUsers} = useSelector((state) => state.chat);
    return (
        <Stack width={w} direction={'column'}>
            <ChatItem  newMessageAlert={null}
                        isOnline={false}
                        avatar={["https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"]}
                        name={"Gemini ai - coming soon!"}
                        groupChat={false}
                        _id={"gemini-ai"}
                        sameSender={false}
                        index={0} 
                        handleDeleteChat={()=>{}} />
            {
                chats?.map((data, index) => {
                    const { avatar, name, id, groupChat, members } = data;
                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === id
                    );
                    
                    const isOnline = members?.some((member) => onlineUsers.includes(member));
                    return <ChatItem key={id}
                        newMessageAlert={newMessageAlert}
                        isOnline={isOnline}
                        avatar={avatar}
                        name={name}
                        groupChat={groupChat}
                        _id={id}
                        sameSender={chatId === id}
                        index={index} 
                        handleDeleteChat={handleDeleteChat}
                        />
                })
            }
        </Stack>
    )
}

export default ChatList