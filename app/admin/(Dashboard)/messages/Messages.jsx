'use client'

import { useFetchData } from "6pp";
import RenderAttachment from "@/components/shared/RenderAttachment";
import Table from "@/components/shared/Table";
import { useError } from "@/hooks/hook";
import { fileFormat, transformImage } from "@/utils/feature";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";


const columns = [
  {
    field: "_id",
    headerName: 'ID',
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: 'Attachments',
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments.length > 0 ? attachments.map((i, idx) => {
        const url = i.url;
        const file = fileFormat(url);

        return (
          <Box key={idx}>
            <a href={url} download={true} target="_blank" style={{ color: "black" }}>
              {
                RenderAttachment(file, url)
              }
            </a>
          </Box>
        )
      }) : "No Attachments"
    }
  },
  {
    field: "content",
    headerName: 'Content',
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "sender",
    headerName: 'Sent By',
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => ( // this is used to render what we want to render or show the table like its an image so that is why this method is used
      <Stack direction={'row'} height={'100%'} spacing={1} alignItems={'center'}>
        <Avatar src={params.row.sender.avatar} alt={params.row.sender.name} />
        <Typography>{params.row.sender.name}</Typography>
      </Stack>
    )
  },

  {
    field: "chat",
    headerName: 'Chat',
    headerClassName: "table-header",
    width: 220,
  },

  {
    field: "groupChat",
    headerName: 'Group Chat',
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: 'Time',
    headerClassName: "table-header",
    width: 250,
  },

];


const Messages = () => {
  const [rows, setRows] = useState([]);


  const { data, loading, error } = useFetchData("/api/admin/messages", "messages-stats", []);
  // const { messages } = data || {};
  console.log(data);

  useError([{ isError: error, error: error }])

  useEffect(() => {
    if (data?.messages) {
      setRows(data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50)
        },
        createdAt: moment(i.createdAt).format('DD/MM/YYYY, h:mm a'),
      }))
      );
    }
  }, [data])
  return !data ? <h2>Loading...</h2> :(
    <Table heading={'All Messages'} row={rows} columns={columns} rowHeight={200} />
  )
}

export default Messages