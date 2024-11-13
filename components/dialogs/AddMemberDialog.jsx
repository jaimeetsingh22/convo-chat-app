import { sampleUsers } from '@/constants/sampleData'
import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '@/redux/reducers/miscSlice'
import { useAsyncMutation, useError } from '@/hooks/hook'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '@/redux/RTK-query/api/api'
import { getSocket } from '@/socket'
import { ALERT, REFETCH_CHATS } from '@/constants/events'

const AddMemberDialog = ({ chatId }) => {


    const socket = getSocket();
    const [members, setMembers] = useState(sampleUsers);
    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMemberMutation);
    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]);
    };
    const dispatch = useDispatch();
    const { isAddMember } = useSelector(state => state.misc)

    const closeHandler = () => {
        dispatch(setIsAddMember(false))
        setSelectedMembers([]);
        setMembers([]);
    }

    const addMemberSubmitHandler = async () => {
        const res = await addMembers("Adding Members...", { chatId, members: selectedMembers });
        // console.log(res.data);
        if (res.data) {
            socket.emit(ALERT, { allMembers: res.data.members, message: res.data.messageForAlert })
            socket.emit(REFETCH_CHATS, { members: res.data.members })
            closeHandler();
        }
    };
    useError([{ isError, error }])

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack
                direction="column"
                spacing={2}
                padding={'2rem'}
                width={'20rem'}

            >
                <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
                <Stack spacing={'1rem'}>
                    {
                        isLoading ? <Skeleton /> : (data?.friends?.length > 0 ? data?.friends?.map((user, index) => (
                            <UserItem key={user._id} user={user} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
                        )) : <Typography textAlign={'center'}> No Friends</Typography>
                        )
                    }
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={1}>
                    <Button color='error' variant='outlined' onClick={closeHandler}>cancel</Button>
                    <Button variant='contained' onClick={addMemberSubmitHandler}
                        disabled={isLoadingAddMembers}
                    >Add members</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog