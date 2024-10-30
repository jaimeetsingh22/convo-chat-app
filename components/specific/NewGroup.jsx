'use client'
import { useInputValidation } from '6pp';
import { sampleUsers } from '@/constants/sampleData';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import UserItem from '../shared/UserItem';
import { useState } from 'react';
import { setIsNewGroup } from '@/redux/reducers/miscSlice';
import { useDispatch, useSelector } from 'react-redux';

const NewGroup = () => {
  const groupName = useInputValidation("");
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();
  const {isNewGroup} = useSelector(state => state.misc)
  const submitHandler = () => { };
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]);
  };
  const isLoadingSendFriendRequest = false;
  const handleClose = ()=>dispatch(setIsNewGroup(false))

  return (
    <Dialog open={isNewGroup} onClose={handleClose}>
      <Stack p={{ xs: '1rem', sm: "2rem" }} spacing={'2rem'} width={'25rem'}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogTitle textAlign={'center'}>
            <Typography fontSize={'1.5rem'} mb={'1rem'}>
              New Group
            </Typography>
          </DialogTitle>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%' }}
        >
          <TextField
            label="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            fullWidth
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ width: '100%' }}
        >
          <Typography>
            Members
          </Typography>
          <Stack
            sx={{
              width: '100%', overflowY: 'auto', maxHeight: '300px', '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'black',
                borderRadius: '10px',
              },
              padding: '0.2rem',
              marginTop: "5px"
            }}
          >
            {members.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))}
          </Stack>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ width: '100%' }}
        >
          <Stack direction={"row"} justifyContent={'space-evenly'}>
            <Button variant='outlined' color='error' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' onClick={submitHandler}>Create</Button>
          </Stack>
        </motion.div>
      </Stack>
    </Dialog>
  )
}

export default NewGroup;
