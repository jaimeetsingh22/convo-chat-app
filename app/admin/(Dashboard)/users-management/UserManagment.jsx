'use client'
import { useFetchData } from '6pp';
import Table from '@/components/shared/Table';
import { useError } from '@/hooks/hook';
import { transformImage } from '@/utils/feature';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

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

  const { data, loading, error } = useFetchData("/api/admin/users", "user-stats", []);
  // const { users } = data || {};


  useError([{ isError: error, error: error }])

  useEffect(() => {
    if (data?.users) {
      setRows(data.users.map(i => ({ ...i, id: i._id, avatar: transformImage(i.avatar, 50) })));
    }
  }, [data]);
  return (
    <Table heading={'All Users'} row={rows} columns={columns} />
  )
}

export default UserManagment