import { ALERT, REFETCH_CHATS } from '@/constants/events'
import { useAsyncMutation } from '@/hooks/hook'
import { setIsDeleteMenu } from '@/redux/reducers/miscSlice'
import { useDeleteChatMutation, useLeaveGroupMutation } from '@/redux/RTK-query/api/api'
import { getSocket } from '@/socket'
import { ExitToApp as ExitToAppIcon, HeartBrokenTwoTone as HeartBrokenIcon, } from '@mui/icons-material'
import { Menu, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
    const { isDeleteMenu, selectedDeleteChat } = useSelector(state => state.misc)
    const router = useRouter();
    const [UnfriendChat] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup] = useAsyncMutation(useLeaveGroupMutation)
    const socket = getSocket();
    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    }

    const leaveGroupHandler = async () => {
        closeHandler();
        const res = await leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
        if (res.data) {
            socket.emit(REFETCH_CHATS, selectedDeleteChat.chatId);
            socket.emit(ALERT, { allMembers: res.data.members, message: res.data.alertMessage, chatId: res.data.chatId });
            // router.push("/");
        }
    };
    const UnfriendHandler = async () => {
        closeHandler();
        const res = await UnfriendChat("Unfriending and Deleting Chat...", selectedDeleteChat.chatId)
        if (res.data) {
            socket.emit(REFETCH_CHATS, { members: res.data.members, chatId: selectedDeleteChat.chatId });
        }
    };

    return (
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            sx={{

            }}
        >
            <Stack

                direction="row"
                spacing={"0.5rem"}
                sx={{
                    width: '10rem',
                    padding: '0.5rem',
                    cursor: "pointer",

                }}
                onClick={selectedDeleteChat.groupChat ? leaveGroupHandler : UnfriendHandler}
                alignItems={"center"}

            >
                {
                    selectedDeleteChat.groupChat ? <> <ExitToAppIcon /> <Typography>Leave Group</Typography></> : <><HeartBrokenIcon /><Typography>Unfriend</Typography></>

                }
            </Stack>
        </Menu>
    )
}

export default DeleteChatMenu