'use client'
import AvatarCard from '@/components/shared/AvatarCard'
import { sampleChats, sampleUsers } from '@/constants/sampleData'
import { motion } from 'framer-motion'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, DriveFileRenameOutline as DriveFileRenameOutlineIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import UserItem from '@/components/shared/UserItem'
import { chatBackground } from '@/constants/color'
import { useSession } from 'next-auth/react'
import { LoadingComponent } from '@/components/LoadingsComponent/Loading'
const ConfirmDeleteDialog = dynamic(() => import('../../components/dialogs/ConfirmDeleteDialog'), {
  ssr: false,
  loading: () => <Backdrop open />
});
const AddMemberDialog = dynamic(() => import('../../components/dialogs/AddMemberDialog'), {
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

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);

    }
    return () => {
      setGroupNameUpdatedValue('');
      setGroupName('');
      setIsEdit(false)
    }
  }, [chatId]);

  if (status === "loading") {
    return <LoadingComponent />;

  }

  // If the user is not authenticated, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login
    return null; // Render nothing while redirecting
  }

  // console.log(chatId);
  const handleMobile = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  }
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    console.log('Group Deleted');
    setConfirmDeleteDialog(false);

  }
  const removeHandler = (id) => {
    console.log('removed', id);
  }

  const isAddMember = false;

  const openAddMemberHandler = () => { };




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
              <IconButton onClick={updateGroupName}>
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
            <IconButton onClick={() => setIsEdit(true)}>
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
        onClick={() => { router.push('/') }}
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
            background: chatBackground,
          }
        }}
        sm={4}
        bgcolor={'bisque'}
      >
        <GroupList myGroups={sampleChats} chatId={chatId} />
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
              }}
            >

              {
                sampleUsers.map((i) => (
                  <UserItem user={i} key={i._id} isAdded styling={{
                    boxShadow: '0 0 0.5rem rgba(0,0,0,0.8)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: 'white'
                  }} handler={removeHandler} />
                ))
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
        isAddMember && <AddMemberDialog />
      }

      <Drawer sx={{
        display: {
          xs: 'block',
          sm: 'none',
        }
      }} open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupList myGroups={sampleChats} w={'50vw'} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}

const GroupList = ({ w = '100%', myGroups = [], chatId }) => (
  <Stack width={w}>
    {
      myGroups.length > 0 ? (myGroups.map((group) => <GroupListItem groups={group} chatId={chatId} key={group._id} />)) : (<Typography variant='h6' sx={{ textAlign: 'center' }}>No Groups</Typography>)
    }

  </Stack>
)

const GroupListItem = ({ groups, chatId }) => {
  const { name, avatar, _id } = groups;
  return <Link href={`?group=${_id}`} style={{
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    display: 'block',
    position: 'relative',
    padding: '0.5rem',
    borderRadius: '10px 0px 10px 0px', // add rounded border
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  }} onClick={e => { if (chatId === _id) e.preventDefault() }}>
    <Stack padding={'1rem'} height={'5rem'} justifyContent={'center'} direction={'row'} alignItems={'center'}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
}

export default Groups