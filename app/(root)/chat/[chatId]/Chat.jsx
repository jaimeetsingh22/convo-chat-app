'use client'
import { useInfiniteScrollTop } from '6pp';
import FileMenu from '@/components/dialogs/FileMenu';
import MessageComponent from '@/components/shared/MessageComponent';
import { InputBox } from '@/components/styles/StyledComponent';
import { NEW_MESSAGE } from '@/constants/events';
import { useError } from '@/hooks/hook';
import useSocketEvents from '@/hooks/useSocketEvents';
import { setIsFileMenu } from '@/redux/reducers/miscSlice';
import { useChatDetailsQuery, useGetMessagesQuery } from '@/redux/RTK-query/api/api';
import { getSocket } from '@/socket';
import { AttachFile as AttachFileIcon, SendOutlined as SendIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loading from '../../loading';



const Chat = () => {
  const params = useParams();
  const chatId = params.chatId;
  const { data: user } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const socket = getSocket();

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(containerRef, oldMessagesChunk.data?.totalPages, page, setPage, oldMessagesChunk.data?.messages);
  const members = chatDetails?.data?.chat?.members;

  const errors = [{ isError: chatDetails.isError, error: chatDetails.error },
  { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ];



  const openFileHandler = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const SendMessageSubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message,
    })
    setMessage("");
  }


  const newMessageHandler = useCallback((data) => {
    setMessages((prevMessages) => [...prevMessages, data?.message]);
  }, [])

  const eventHandler = { [NEW_MESSAGE]: newMessageHandler };

  useSocketEvents(socket, eventHandler);

  useError(errors);

  const allMessages = [...oldMessages, ...messages]

  // Scroll to the bottom on initial load
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  // Auto-scroll to the bottom on new message
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);


  return chatDetails.isLoading ? <Loading /> : (
    <>
      <Stack ref={containerRef}
        boxSizing={'border-box'}
        padding={'1rem'}
        spacing={'1rem'}
        height={'90%'}
        bgcolor={'rgba(240,240,240,0.3)'}
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto', '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: 'black',
            borderRadius: '10px',
          },
        }}
      >

        {
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user?.user} />
          ))
        }
      </Stack>

      <form style={{
        height: '10%'
      }}
        onSubmit={SendMessageSubmitHandler}
      >
        <Stack direction={'row'} height={'100%'} alignItems={'center'} padding={'1rem'} position={'relative'}>
          <IconButton sx={{
            position: 'absolute',
            left: '1.5rem',
            rotate: '30deg'
          }}
            onClick={openFileHandler}
          >
            <AttachFileIcon />
          </IconButton >
          <InputBox placeholder='Type your message here...' value={message} onChange={(e) => setMessage(e.target.value)} />
          <IconButton sx={{
            color: 'white',
            marginLeft: '0.5rem',
            bgcolor: 'primary.main',
            padding: '0.5rem',
            "&:hover": {
              bgcolor: 'primary.dark',
            },
          }} type='submit' >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  )
}

export default Chat