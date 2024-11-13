'use client'
import { headergradient, headerTextgradient1, headerTextgradient2 } from '@/constants/color';
import { resetNotification, setNotificationCount } from '@/redux/reducers/chat';
import { setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch } from '@/redux/reducers/miscSlice';
import { useGetNotificationQuery } from '@/redux/RTK-query/api/api';
import { Add as AddIcon, Menu as MenuIcon, Search as SearchIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationIcon } from '@mui/icons-material';
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
const SearchBox = dynamic(
  () => import('../specific/Search')
)
const NewGroup = dynamic(
  () => import('../specific/NewGroup')
)

const NotificationBox = dynamic(
  () => import('../specific/Notification')
)

const Header = (userData) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { isSearch, isNewGroup, isNotification } = useSelector(state => state.misc)
  const { notificationCount: value } = useSelector(state => state.chat)
  const { data } = useGetNotificationQuery({refetchOnMountOrArgChang: value < 0 });
  useEffect(() => {
    if (data) {
      dispatch(setNotificationCount(data?.allRequests?.length));
    }
    return ()=>{
      dispatch(resetNotification());
    }
  }, [data,dispatch])


  const handleMobile = () => { dispatch(setIsMobileMenu(true)) };
  const openSearch = () => { dispatch(setIsSearch(true)) };
  const openNotification = () => {
    dispatch(setIsNotification(true))
    dispatch(resetNotification())
  };
  const openNewGroup = () => { dispatch(setIsNewGroup(true)) };
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }



  return (
    <>
      <Box height={'4rem'} sx={{ flexGrow: 1 }} >
        <AppBar position='static' sx={{
          background: headergradient,
        }}>
          <Toolbar>
            <Tooltip title='Home'>
              <Typography variant='h4' sx={{
                display: { xs: 'none', sm: 'block', }, cursor: 'pointer',
                fontWeight: 'bold',
                background: headerTextgradient2, // Add gradient effect
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} onClick={() => router.push('/')}>
                Convo!
              </Typography>
            </Tooltip>

            <Box sx={{ display: { xs: 'block', sm: 'none' } }} >
              <IconButton color='inherit' onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Tooltip title="Search">
                <IconButton color='inherit' size='large' onClick={openSearch}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='New Group'>
                <IconButton color='inherit' size='large' onClick={openNewGroup}>
                  <AddIcon />
                </IconButton>
              </Tooltip>


              <Tooltip title='Manage Groups'>
                <IconButton color='inherit' size='large' onClick={() => router.push('/groups')}>
                  <GroupIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='Notifications'>
                <IconButton color='inherit' size='large' onClick={openNotification}>
                  {
                    value ? <Badge badgeContent={value} color='error'><NotificationIcon /></Badge> : <NotificationIcon />
                  }
                </IconButton>
              </Tooltip>

              <Tooltip title='Logout'>
                <IconButton color='inherit' size='large' onClick={handleSignOut}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>

            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && <SearchBox />
      }
      {
        isNewGroup && <NewGroup userData={userData}/>
      }
      {
        isNotification && <NotificationBox />
      }
    </>
  )
}

export default Header