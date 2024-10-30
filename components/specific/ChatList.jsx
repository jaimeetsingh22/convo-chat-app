'use client'
import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    w = '100%',
    router,
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [{
        chatId: "",
        count: 0,
    }],
    handleDeleteChat,
}) => {
    return (
        <Stack width={w} direction={'column'}>
            {
                chats?.map((data, index) => {
                    const { avatar, name, id, groupChat, members } = data;
                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === id
                    )
                    const isOnline = members?.some((member) => onlineUsers.includes(id));
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