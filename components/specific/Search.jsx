'use client'
import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, InputAdornment, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '@/redux/reducers/miscSlice'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '@/redux/RTK-query/api/api'
import { useAsyncMutation } from '@/hooks/hook'
import { getSocket } from '@/socket'
import { NEW_REQUEST } from '@/constants/events'

const Search = () => {
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch();
  const { isSearch } = useSelector(state => state.misc)
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest,requestData] = useAsyncMutation(useSendFriendRequestMutation);
  const socket = getSocket()
  const addFriendHandler = async (id) => {
    const res = await sendFriendRequest("Sending Friend Request...", { userId: id });
    console.log("add friend handler: ",res);
    
    if (res.data) {
      // Friend request was successful, emit the event
      socket.emit(NEW_REQUEST, { userId: id });
    } else if (res.error) {
      console.log("Friend request failed:", res.error);
      // Optionally, handle the case where the friend request was already sent
    }
  };

  const handleClose = () => dispatch(setIsSearch(false))

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    const timeOutId = setTimeout(() => {
      searchUser(search.value).then(({ data }) => {
        setUsers(data?.users || []);
        setIsLoading(false);
        if (data?.users?.length === 0) {
          setNotFound(true);
        }
      }).catch(err => {
        console.log(err);
        setIsLoading(false);
        setNotFound(true);
      })
    }, 1000);

    return () => {
      clearTimeout(timeOutId)
    }
  }, [search.value,searchUser])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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

  return (
    <Dialog open={isSearch} onClose={handleClose}>
      <Stack sx={{ padding: 4, width: '25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogTitle textAlign={'center'}>
            <Typography fontSize={'1.5rem'}>
              Find people
            </Typography>
          </DialogTitle>
          <TextField
            label=""
            value={search.value}
            onChange={search.changeHandler}
            variant='outlined'
            size='small'
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </motion.div>

        <Stack sx={{
          width: '100%', overflowY: 'auto', maxHeight: '300px', '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          ' ::-webkit-scrollbar-thumb': {
            backgroundColor: 'black',
            borderRadius: '10px',
          },
          padding: '0.2rem',
          marginTop: "5px"
        }}>
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
              {users.map((user, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <UserItem
                    user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {notFound && (
            <Typography sx={{ textAlign: 'center', padding: '20px' }}>
              Not found
            </Typography>
          )}
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default Search
