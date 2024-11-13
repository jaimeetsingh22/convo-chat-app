'use client'
import { useInfiniteScrollTop } from '6pp';
import FileMenu from '@/components/dialogs/FileMenu';
import MessageComponent from '@/components/shared/MessageComponent';
import { InputBox } from '@/components/styles/StyledComponent';
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '@/constants/events';
import { useError } from '@/hooks/hook';
import useSocketEvents from '@/hooks/useSocketEvents';
import { setIsFileMenu } from '@/redux/reducers/miscSlice';
import { useChatDetailsQuery, useGetMessagesQuery } from '@/redux/RTK-query/api/api';
import { getSocket } from '@/socket';
import { AttachFile as AttachFileIcon, SendOutlined as SendIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loading from '@/app/(root)/(home)/loading';
import { removeNewMessageAlert } from '@/redux/reducers/chat';
import TypingLayout from '@/components/specific/TypingLayout';
import { v4 } from 'uuid';



const Chat = () => {
  const params = useParams();
  const chatId = params.chatId;
  const { data: user } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeOut = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
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

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId))

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    }
  }, [chatId]);

  const messagOnChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);

    }, 1000);
  }

  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prevMessages) => [...prevMessages, data?.message]);
  }, [chatId]);
  const alertListener = useCallback(({ message }) => {
    // if (data.chatId !== chatId) return;
    const messageForAlert = {
      content: message,
      _id: v4(),
      sender: {
        _id: "asldkjfkjdvksdjf",
        name: "Group Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, messageForAlert]);
  }, [chatId]);



  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId])
  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId])



  const eventHandler = { [NEW_MESSAGE]: newMessagesListener, [NEW_ATTACHMENT]: newMessagesListener, [START_TYPING]: startTypingListener, [STOP_TYPING]: stopTypingListener, [ALERT]: alertListener };

  useSocketEvents(socket, eventHandler);

  useError(errors);


  const allMessages = [...oldMessages, ...messages]

  // Scroll to the bottom on initial load
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // useEffect(() => {
  //   if (!chatDetails.data?.chat) {
  //     return router.replace("/");
  //   }
  // }, [chatDetails.data])


  // Auto-scroll to the bottom on new message
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, userTyping]);


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
        {userTyping && (<TypingLayout />)}
        <div ref={bottomRef} />
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
          <InputBox placeholder='Type your message here...' value={message} onChange={messagOnChangeHandler} />
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