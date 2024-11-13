'use client'
import { useInputValidation } from '6pp';
import { sampleUsers } from '@/constants/sampleData';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography, Paper, Skeleton } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import UserItem from '../shared/UserItem';
import { useState } from 'react';
import { setIsNewGroup } from '@/redux/reducers/miscSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '@/redux/RTK-query/api/api';
import { useAsyncMutation, useError } from '@/hooks/hook';
import toast from 'react-hot-toast';
import { getSocket } from '@/socket';
import { ALERT } from '@/constants/events';

const NewGroup = () => {
  const groupName = useInputValidation("");
  const { isError, error, data, isLoading } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setIsNewGroup(false))
  const { isNewGroup } = useSelector(state => state.misc)
  const socket = getSocket();

  const submitHandler = async () => {
    if (selectedMembers.length < 2) return toast.error("Please select at least 2 members");;
    if (!groupName.value) return toast.error("Please enter group name");
    // console.log(groupName.value, selectedMembers)
    //creating Group
    const res = await newGroup("Creating Group...", { name: groupName.value, members: selectedMembers });
    if (res.data) {
      // emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);      
      const message = `Welcome to ${groupName.value} group`;
      console.log(message);
      socket.emit(ALERT, { allMembers: selectedMembers, message });
    }
    handleClose();
  };
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]);
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
  }
  useError([{ isError, error }])

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
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Skeleton variant="text" sx={{ width: '100%', height: '40px', margin: '10px 0' }} />
                <Skeleton variant="text" sx={{ width: '100%', height: '40px', margin: '10px 0' }} />
                <Skeleton variant="text" sx={{ width: '100%', height: '40px', margin: '10px 0' }} />
              </motion.div>
            ) : (
              <AnimatePresence>
                {data?.friends?.map((user, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <UserItem
                      user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
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
            <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
          </Stack>
        </motion.div>
      </Stack>
    </Dialog>
  )
}

export default NewGroup;
