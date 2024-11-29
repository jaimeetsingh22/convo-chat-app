'use client'
import ChatlistSkeleton from '@/components/LoadingsComponent/ChatlistSkeleton'
import GroupsLoadingSkeleton from '@/components/LoadingsComponent/GroupLoading'
import { LoadingComponent } from '@/components/LoadingsComponent/Loading'
import AvatarCard from '@/components/shared/AvatarCard'
import UserItem from '@/components/shared/UserItem'
import { chatBackground, chatListBackground } from '@/constants/color'
import { ALERT, REFETCH_CHATS } from '@/constants/events'
import { useAsyncMutation, useError } from '@/hooks/hook'
import { setIsAddMember } from '@/redux/reducers/miscSlice'
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '@/redux/RTK-query/api/api'
import { getSocket } from '@/socket'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, DriveFileRenameOutline as DriveFileRenameOutlineIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
const ConfirmDeleteDialog = dynamic(() => import('@/components/dialogs/ConfirmDeleteDialog'), {
  ssr: false,
  loading: () => <Backdrop open />
});
const AddMemberDialog = dynamic(() => import('@/components/dialogs/AddMemberDialog'), {
  ssr: false,
  loading: () => <Backdrop open />
});


const Groups = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const chatId = useSearchParams().get('group');
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const socket = getSocket();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector(state => state.misc)
  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId })
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);
  const [members, setMembers] = useState([]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error }
  ]
  useError(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }
    return () => {
      setGroupName('');
      setGroupNameUpdatedValue('');
      setMembers([]);
      setIsEdit(false);
    }
  }, [groupDetails.data])




  const handleMobile = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const updateGroupName = async () => {
    const res = await updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue })
    if (res.data) {
      setIsEdit(false);
      socket.emit(REFETCH_CHATS, { members: res.data.chat.members })
    }


  }
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = async () => {
    const res = await deleteGroup("Deleting Group...", chatId);
    console.log(res.data);
    if (res.data) {
      socket.emit(REFETCH_CHATS, { members: res.data.members, chatId });
      // socket.emit(ALERT,{allMembers})
      setConfirmDeleteDialog(false);
      setGroupName('');
      setGroupNameUpdatedValue('');
      setMembers([]);
      setIsEdit(false);
      router.push('/groups')
    }

  }
  const removeHandler = async (id) => {
    const res = await removeMember("Removing Member...", { chatId, userId: id });
    console.log(res.data)
    if (res.data) {
      socket.emit(REFETCH_CHATS, { members: res.data.members, chatId });
      socket.emit(ALERT, { allMembers: res.data.members, message: res.data.removedMemberMemberMessage, chatId: res.data.chatId })
    }
    console.log('removed', id);
  }


  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true))
  };



  if (status === "loading") {
    return <GroupsLoadingSkeleton />;
  }

  const GroupName = <>
    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'} padding={'2rem'}>

      {
        isEdit ? <>

          <motion.div initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, }}
            style={{
              height: 'auto'
            }}
          >
            <TextField placeholder='Edit group name'

              value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
          </motion.div>
          <motion.span initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, }}
          >
            <Tooltip title='Save' placement='top' arrow>
              <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </motion.span>
        </> : <>
          <motion.span initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, }}
          >
            <Typography variant='h4'>{groupName}</Typography>
          </motion.span>
          <Tooltip title='Edit Group Name'>
            <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
              <motion.span initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, }}
              >
                <DriveFileRenameOutlineIcon />
              </motion.span>
            </IconButton>
          </Tooltip>
        </>
      }
    </Stack>
  </>

  const IconBtns = <>
    <Box
      sx={{
        display: {
          xs: 'block',
          sm: 'none'
        },
        position: 'absolute',
        top: '1.5rem',
        right: '1rem'
      }}
    >
      <IconButton onClick={handleMobile}>
        <MenuIcon />
      </IconButton>
    </Box>
    <Tooltip title="Back">
      <IconButton
        sx={{
          position: 'absolute',
          left: '2rem',
          top: '2rem',
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white',
          ":hover": {
            bgcolor: 'rgba(0,0,0,0.7)',
          }
        }}
        onClick={() => { router.replace('/') }}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
    </Tooltip>
  </>

  const ButtonGroup = <>
    <Stack
      direction={{
        sm: 'row',
        xs: 'column-reverse'
      }}
      spacing={2}
      padding={{
        sm: '1rem',
        xs: '0',
        md: '1rem 4rem'
      }}
    >
      <Button size='large' color='error' variant='outlined' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  </>

  // If the user is not authenticated, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login
    return null; // Render nothing while redirecting
  }

  return (
    <Grid container height={'100vh'} >
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
            height: '100vh',
            overflowY: "auto",
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'black',
              borderRadius: '10px',
            },
            background: chatListBackground,
            padding: '0.5rem'
          }
        }}
        sm={4}
        bgcolor={'bisque'}
      >
        {myGroups.isLoading ? <ChatlistSkeleton /> : (<GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />)}
      </Grid>
      <Grid item
        xs={12}
        sm={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          padding: '1rem 2rem',
          height: '100vh',
        }}
      >
        {IconBtns}
        {
          groupName && (<>
            {GroupName}

            <Typography
              alignSelf={'flex-start'}
              margin={'2rem'}
              variant='body1'
            >Members</Typography>
            <Stack
              maxWidth={'45rem'}
              width={'100%'}
              boxSizing={'border-box'}
              padding={{
                xs: '0',
                sm: '1rem',
                md: '1rem 4rem'
              }}
              spacing={'1rem'}
              bgcolor={'rgba(0,0,0,0.1)'}
              height={'50vh'}
              sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'black',
                  borderRadius: '10px',
                },
                position: "relative"
              }}
            >

              {isLoadingRemoveMember ? <CircularProgress sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)"
              }} /> :
                (members.map((i) => (
                  <UserItem user={i} key={i._id} isAdded styling={{
                    boxShadow: '0 0 0.5rem rgba(0,0,0,0.8)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: 'white'
                  }} handler={removeHandler} />
                )))
              }

            </Stack>
            {ButtonGroup}
          </>)}
      </Grid>
      {
        confirmDeleteDialog && <>
          <ConfirmDeleteDialog open={confirmDeleteDialog} deleteHandler={deleteHandler} handleClose={closeConfirmDeleteHandler} />
        </>
      }

      {
        isAddMember && <AddMemberDialog chatId={chatId} />
      }

      <Drawer sx={{
        display: {
          xs: 'block',
          sm: 'none',
        }
      }} open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupList myGroups={myGroups?.data?.groups} w={'50vw'} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}

const GroupList = ({ w = '98%', myGroups = [], chatId }) => (
  <Stack width={w} >
    {
      myGroups.length > 0 ? (myGroups.map((group) => <GroupListItem groups={group} chatId={chatId} key={group.id} />)) : (<Typography variant='h6' sx={{ textAlign: 'center' }}>No Groups</Typography>)
    }

  </Stack>
)

const GroupListItem = ({ groups, chatId }) => {
  const { name, avatar, id } = groups;
  return <Link href={`?group=${id}`} style={{
    position: 'relative',
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    display: 'block',
    padding: '0.5rem',
    borderRadius: '10px 0px 10px 0px', // add rounded border
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '30px',
    margin: '0.5rem',
    backgroundColor: '#ffffffb3',
  }} onClick={e => { if (chatId === id) e.preventDefault() }}>
    <Stack padding={'1rem'} height={'5rem'} justifyContent={'center'} direction={'row'} alignItems={'center'}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
}

export default Groups