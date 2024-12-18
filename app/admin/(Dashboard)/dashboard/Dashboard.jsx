'use client'
import { CurveButton, SearchField } from '@/components/styles/StyledComponent'
import { AdminPanelSettings, Group as GroupIcon, Message as MessageIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { Notifications as NotificationIcon } from '@mui/icons-material'
import { DoughnutChart, LineChart } from '@/components/specific/Charts'
import { useFetchData } from '6pp'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useError } from '@/hooks/hook'
import DashboardSkeleton from '@/components/LoadingsComponent/DashBoardSkeleton'




const Dashboard = () => {

  const { data, loading, error } = useFetchData("/api/admin/dashboard", "dashboard-stats", []);
  const { stats, messageChart } = data || {};


  useError([{ isError: error, error: error }])

  const AppBar = <Paper
    elevation={3} // its for box shadow
    sx={{
      padding: '2rem',
      margin: '2rem 0',
      borderRadius: "1rem"
    }}
  >
    <Stack direction={'row'} alignItems={"center"} spacing={'1rem'}>
      <AdminPanelSettings fontSize='large' />
      <SearchField placeholder='Search...' />
      <CurveButton>Search</CurveButton>
      <Box flexGrow={1} />
      <Typography
        sx={{
          display: {
            xs: 'none',
            lg: "block"
          }
        }}
      >
        {moment().format("dddd, Do MMMM YYYY")}
      </Typography>
    </Stack>
  </Paper>
  const Widgets = <Stack direction={{
    xs: 'column',
    sm: "row"
  }}
    justifyContent={'space-between'}
    alignItems={'center'} spacing={2}
    margin={'2rem 0'}
  >
    <Widget title={'Users'} value={stats?.usersCounts || 0} Icon={<PersonIcon />} />
    <Widget title={'Chats'} value={stats?.totalChatsCount || 0} Icon={<GroupIcon />} />
    <Widget title={'Messages'} value={stats?.totalMessagesCount || 0} Icon={<MessageIcon />} />
  </Stack>

  return !data ? <DashboardSkeleton /> : ( // will add skeleton for it
    <Container component={'main'}>
      {AppBar}
      <Stack direction={{
        xs: 'column',
        lg: "row"
      }}
        sx={{
          gap: '2rem'
        }}
        justifyContent={'center'}
        alignItems={{
          xs: 'center',
          lg: "stretch"
        }}
        flexWrap={'wrap'}>
        <Paper elevation={3}
          sx={{
            padding: '2rem 3.5rem',
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "45rem",
          }}
        >
          <Typography margin={"2rem 0"} variant='h4'>
            Last Messages
          </Typography>
          <LineChart value={messageChart || []} />
        </Paper>

        <Paper elevation={3}
          sx={{
            padding: '1rem',
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "25rem",
            display: "flex",
            alignItems: 'center',
            justifyContent: "center",
            position: "relative",
            width: {
              xs: "100%",
              sm: '50%'
            },
          }}
        >
          <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[stats?.totalsingleChatcount || 0, stats?.groupsCount || 0]} />
          <Stack
            position={'absolute'}
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={'0.5rem'}
            width={'100%'}
            height={'100%'}
          >
            <GroupIcon /> <Typography>vs</Typography> <PersonIcon />
          </Stack>
        </Paper>
      </Stack>
      {Widgets}
    </Container>
  )
}

export default Dashboard;

const Widget = ({ title, value, Icon }) => <Paper
  elevation={3}
  sx={{
    padding: '2rem',
    borderRadius: "2rem",
    width: '20rem',
    margin: '2rem 0'
  }}
>
  <Stack alignItems={'center'} spacing={1} >
    <Typography
      sx={{
        color: 'rgba(0,0,0,0.8)',
        borderRadius: "50%",
        border: '5px solid black',
        width: "5rem",
        height: "5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >{value}</Typography>
    <Stack direction={'row'} alignItems={'center'} spacing={1}>
      {Icon}
      <Typography>{title}</Typography>
    </Stack>

  </Stack>
</Paper>