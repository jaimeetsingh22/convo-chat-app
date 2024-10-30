import { sampleUsers } from '@/constants/sampleData'
import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ addMembers, isLoadingAddMember, chatId }) => {



    const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]);
    };


    const closeHandler = () => {
        setSelectedMembers([]);
        setMembers([]);
        console.log('close');
    }

    const addMemberSubmitHandler = () => {
        closeHandler();
    };

    return (
        <Dialog open onClose={closeHandler}>
            <Stack
                direction="column"
                spacing={2}
                padding={'2rem'}
                width={'20rem'}

            >
                <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
                <Stack spacing={'1rem'}>
                    {
                        members.length > 0 ? members.map((user, index) => (
                            <UserItem key={user._id} user={user} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
                        )) : <Typography textAlign={'center'}> No Friends</Typography>

                    }
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={1}>
                    <Button color='error' variant='outlined' onClick={closeHandler}>cancel</Button>
                    <Button variant='contained' onClick={addMemberSubmitHandler}
                    //  disabled={isLoadingAddMember}
                    >Add members</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog