'use client'
import { REFETCH_CHATS } from '@/constants/events';
import { useAsyncMutation, useError } from '@/hooks/hook';
import { resetNotification } from '@/redux/reducers/chat';
import { setIsNotification } from '@/redux/reducers/miscSlice';
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '@/redux/RTK-query/api/api';
import { getSocket } from '@/socket';
import { Check, Close } from '@mui/icons-material';
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const Notification = () => {

  const dispatch = useDispatch();
  const { isNotification } = useSelector(state => state.misc)
  const { isLoading, isError, error, data } = useGetNotificationQuery();
  const [acceptRequest, isLoadingacceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  console.log()
  const socket = getSocket();
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(resetNotification())
    const res = await acceptRequest(accept ? "Accepting Request...":"Rejecting Request...", { requestId: _id, accept });
    if (res.data?.success) {
      socket.emit(REFETCH_CHATS, { members: [_id] });
      dispatch(setIsNotification(false));
    }
  };

  const handleClose = () => {
    dispatch(setIsNotification(false))
  }

  useError([{ error, isError }])
  return (
    <Dialog open={isNotification} onClose={handleClose}>
      <Stack
        p={{ xs: '1rem', sm: '2rem' }}
        spacing={2}
        maxWidth={'25rem'}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)', // Light semi-transparent background
          backdropFilter: 'blur(10px)', // Blurred background
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogTitle>
            Notifications
          </DialogTitle>
        </motion.div>
        {
          isLoading ? <div>Loading...</div> : <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ _id, sender }) => (
                <NotificationItem _id={_id} key={_id} loading={isLoadingacceptRequest} handler={friendRequestHandler} sender={sender} />
              ))
            ) : (
              <Typography textAlign={'center'}> 0 Notifications</Typography>
            )}
          </>
        }
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ _id, sender, handler,loading }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    style={{ width: '100%' }}
  >
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width={'100%'}
      >
        <Avatar src={sender?.avatar} />
        <Tooltip title={`${sender?.name} sent you friend request.`}>

          <Typography
            variant='body1'
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              cursor: "default"
            }}
          >
            {`${sender?.name} sent you a friend request.`}
          </Typography>
        </Tooltip>
        <Stack
          direction={{
            xs: 'column',
            sm: 'row'
          }}
          spacing={1}
        >
          <Button onClick={() => handler({ _id, accept: true })} disabled={loading}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })} disabled={loading}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  </motion.div>
));

NotificationItem.displayName = "NotificationItem"; 
export default Notification;
