'use client'
import AvatarCard from '@/components/shared/AvatarCard';
import Table from '@/components/shared/Table'
import { dashBoardData } from '@/constants/sampleData';
import { transformImage } from '@/utils/feature';
import { Avatar, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react'

// there is mistake in this component will fix it later!

const columns = [
  {
    field: "id",
    headerName: 'ID',
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: 'Avatar',
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => ( // this is used to render what we want to render or show the table like its an image so that is why this method is used
      <Avatar src={params.row.avatar} alt={params.row.name} />
    )
  },
  {
    field: "name",
    headerName: 'Name',
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalMembers",
    headerName: 'Total Members',
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "members",
    headerName: 'Members',
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => <div style={{
      position: 'relative'
    }}>
      <AvatarCard avatar={params.row.members} top='0rem' />
    </div>
  },
  {
    field: "totalMessage",
    headerName: 'Total Messages',
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: 'Created By',
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={'center'} spacing={'1rem'}>
        <Avatar src={params.row.creator.avatar} alt={params.row.creator.name} />
        <Typography variant="body1">{params.row.creator.name}</Typography>
      </Stack>
    )
  },


];

const ChatManagment = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashBoardData.chats.map(i => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map(i => transformImage(i, 50)),
        members: i.members.map(i => transformImage(i.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50)
        }
      }))
    )
  }, []);
  return (
    <Table heading={'All Chats'} row={rows} columns={columns} />
  )
}

export default ChatManagment