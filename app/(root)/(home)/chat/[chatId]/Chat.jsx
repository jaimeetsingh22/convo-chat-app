'use client'
import { useInfiniteScrollTop } from '6pp';
import Loading from '@/app/(root)/(home)/loading';
import FileMenu from '@/components/dialogs/FileMenu';
import MessageComponent from '@/components/shared/MessageComponent';
import TypingLayout from '@/components/specific/TypingLayout';
import { InputBox } from '@/components/styles/StyledComponent';
import { attachFileIconColor, chatMessagesBackgroundColor, chatMessagesHeaderColor, chatMessagesHeaderIconsColor, chatMessagesHeaderTextColor, sendButtonColor, sendMessageFormBackgroundColor } from '@/constants/color';
import { ALERT, CALL, NEW_ATTACHMENT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '@/constants/events';
import { useError } from '@/hooks/hook';
import useSocketEvents from '@/hooks/useSocketEvents';
import { removeNewMessageAlert, setIsVoiceCall, setLocalStream, setOnGoingCall } from '@/redux/reducers/chat';
import { setIsFileMenu } from '@/redux/reducers/miscSlice';
import { useChatDetailsQuery, useGetMessagesQuery } from '@/redux/RTK-query/api/api';
import { getSocket } from '@/socket';
import { AttachFile as AttachFileIcon, Call, Camera, SendOutlined as SendIcon, VideoCall } from '@mui/icons-material';
import { IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
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
  const { onlineUsers } = useSelector((state) => state.chat);

  const {socket,getMediaStream,setIsCallEnded }= getSocket();
  const query = useSearchParams();
  const chatUserName = query.get("name");

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
    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId, dispatch, setOldMessages]);

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
    // console.log(data.chatId,chatId)
    // console.log(Boolean(data.chatId !== chatId));
    if (data.chatId !== chatId) return;
    setMessages((prevMessages) => [...prevMessages, data?.message]);
  }, [chatId]);
  const alertListener = useCallback((data) => {
    // const activeMembers = data.allMembers.find(i => user.user.id.toString() === i.toString());
    toast.success(data.message)

    if (data.chatId !== chatId) return;

    const messageForAlert = {
      content: data.message,
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



  // video and audio call feature setup
  // function for accessing video camera
  const { onGoingCall } = useSelector(state => state.chat);
  const callerId = members?.find(member => member === user.user.id);
  const recieverName = onGoingCall?.participants?.receiver?.name;
  const recieverAvatar = onGoingCall?.participants?.receiver?.avatar;



  const handleVideoCall = useCallback(async () => {
    setIsCallEnded(false);
    if(!socket) return;
    const stream = await getMediaStream();

    if(!stream) {
      toast.error("failed to access camera");
      console.log("no stream in handle video call");
      return;
    };

    const receiver = members?.find(member => member !== user.user.id);
    const participants = {
      caller: {
        id: callerId,
        name: user.user.name,
        avatar: user.user.avatar.url
      },
      receiver: {
        id: receiver,
        name: recieverName,
        avatar: recieverAvatar
      },isVoiceCall:false
    }

    dispatch(setOnGoingCall({
      participants
    }));
    socket.emit(CALL, participants);
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message: "📹 Video call started",
    })
    setMessage("");

  }, [callerId, dispatch, onGoingCall,socket]);
  
  const handleVoiceCall = useCallback(async () => {
    setIsCallEnded(false);
    if(!socket) return;
    const stream = await getMediaStream();

    if(!stream) {
      toast.error("failed to access camera");
      console.log("no stream in handle video call");
      return;
    };

    const receiver = members?.find(member => member !== user.user.id);
    const participants = {
      caller: {
        id: callerId,
        name: user.user.name,
        avatar: user.user.avatar.url
      },
      receiver: {
        id: receiver,
        name: recieverName,
        avatar: recieverAvatar
      },isVoiceCall:true
    }

    dispatch(setOnGoingCall({
      participants
    }));
    dispatch(setIsVoiceCall(true));
    socket.emit(CALL, participants);
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message: "📞 Voice call started",
    })
    setMessage("");

  }, [callerId, dispatch, onGoingCall,socket]);



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


  useEffect(() => {
    if (chatDetails.isError) return router.push("/");
  }, [chatDetails, router]);


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
        // padding={'1rem'}
        spacing={'1rem'}
        height={'90%'}
        bgcolor={chatMessagesBackgroundColor}
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
          position: 'relative',
        }}
      >
        <Paper elevation={5} sx={{
          backgroundColor: chatMessagesHeaderColor, position: 'sticky',
          width: '100%',
          zIndex: 100,
          top: '0',
          left: '0',
          padding: '0.5rem',
        }} >
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h6" sx={{ color: chatMessagesHeaderTextColor, fontWeight: 'bold', textTransform: 'capitalize' }}>
              {chatUserName}
            </Typography>
            {/* camera icon and call icon on the right side */}
            <Stack direction={'row'} spacing={'1rem'}>
              <Tooltip title="Video Call">
                <IconButton onClick={handleVideoCall} sx={{ color: chatMessagesHeaderIconsColor }}>
                  <VideoCall />
                </IconButton>
              </Tooltip>
              <Tooltip title="Voice Call">
                <IconButton onClick={handleVoiceCall} sx={{ color: chatMessagesHeaderIconsColor }}>
                  <Call />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>
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
        <Stack direction={'row'} height={'100%'} alignItems={'center'} padding={'1rem'} position={'relative'} sx={{ backgroundColor: sendMessageFormBackgroundColor }}>
          <IconButton sx={{
            position: 'absolute',
            left: '1.5rem',
            rotate: '30deg'
          }}
            onClick={openFileHandler}
          >
            <AttachFileIcon sx={{ color: attachFileIconColor }} />
          </IconButton >
          <InputBox placeholder='Type your message here...' value={message} onChange={messagOnChangeHandler} />
          <IconButton sx={{
            color: 'white',
            marginLeft: '0.5rem',
            bgcolor: sendButtonColor,
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