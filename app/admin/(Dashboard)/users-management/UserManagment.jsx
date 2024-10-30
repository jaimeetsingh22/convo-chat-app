'use client'
import Table from '@/components/shared/Table'
import { dashBoardData } from '@/constants/sampleData';
import { transformImage } from '@/utils/feature';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react'

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
    width: 200,
  },
  {
    field: "username",
    headerName: 'Username',
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: 'Friends',
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: 'Groups',
    headerClassName: "table-header",
    width: 200,
  },

];

const UserManagment = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(dashBoardData.users.map(i => ({ ...i, id: i._id, avatar: transformImage(i.avatar, 50) })));
  }, []);
  return (
    <Table heading={'All Users'} row={rows} columns={columns} />
  )
}

export default UserManagment