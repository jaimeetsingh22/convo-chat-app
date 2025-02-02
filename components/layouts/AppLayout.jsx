"use client";
import Header from "@/components/layouts/Header";
import { LoadingComponent } from "@/components/LoadingsComponent/Loading";
import ChatList from "@/components/specific/ChatList";
import Profile from "@/components/specific/Profile";
import { chatListBackground, profileBackground } from "@/constants/color";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "@/constants/events";
import useSocketEvents from "@/hooks/useSocketEvents";
import { increamentNotificaton, setNewMessageAlert } from "@/redux/reducers/chat";
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from "@/redux/reducers/miscSlice";
import { useMyChatsQuery } from "@/redux/RTK-query/api/api";
import { getSocket } from "@/socket";
import { getOrSaveFromStorage } from "@/utils/feature";
import { CssBaseline, Drawer, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CallNotificationDialog from "../dialogs/CallNotificationDialog";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import ChatlistSkeleton from "../LoadingsComponent/ChatlistSkeleton";
import VideoCall from "../specific/VideoCall";


const AppLayout = ({ children }) => {
  const { chatId } = useParams();
  const { status, data: userData } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { socket } = getSocket();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { isLoading, data, refetch } = useMyChatsQuery();
  const isMobileMenu = useSelector(state => state.misc.isMobileMenu);
  const { newMessageAlert, onGoingCall ,isRinging} = useSelector(state => state.chat);
  const deleteMenuAnchorRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !welcomeShown) {
      setWelcomeShown(true);
      toast.success(`Welcome back ${userData.user.name}`);
    }
  }, [status, welcomeShown, userData, router]);


  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlert })
  }, [newMessageAlert])

  const handleDeleteChat = (e, chatId, groupChat) => {
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    deleteMenuAnchorRef.current = e.currentTarget;
  };

  const newMessageAlertHandler = useCallback((data) => {
    if (data.chatId === chatId) return;
    dispatch(setNewMessageAlert(data));
  }, [chatId, dispatch])

  const newRequestHandler = useCallback((data) => {


    dispatch(increamentNotificaton());
  }, [dispatch]);

  const refetchListener = useCallback((data) => {

    refetch();

    if (chatId !== data.chatId) { router.push("/"); };

  }, [refetch, chatId, router])




  const eventHandlers = {
    [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
    [NEW_REQUEST]: newRequestHandler,
    [REFETCH_CHATS]: refetchListener,
  };
  const handleMobileClose = () => dispatch(setIsMobileMenu(false));

  useSocketEvents(socket, eventHandlers);


  if (status === "loading") return <LoadingComponent />;
  if (status === "unauthenticated") return null;

  return (
    <div onContextMenu={(e) => {
      // e.preventDefault();

    }}>
      <NextTopLoader showSpinner={false} />
      <CssBaseline />
      <Header userData={userData} />
      <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchorRef} />
      {/* {isRinging && <CallNotificationDialog />}
      <VideoCall /> */}
      <Drawer open={isMobileMenu} onClose={handleMobileClose} >
        <div style={{
          background: chatListBackground,
          height: "100vh"
        }}>

          {isLoading ? (
            <ChatlistSkeleton />
          ) : (<ChatList
            w="70vw"
            chats={data?.chats}

            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessageAlert}
          />)}
        </div>
      </Drawer>


      <Grid container height="calc(100vh - 4rem)">
        <Grid
          item sm={4} md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            bgcolor: "ButtonShadow",
            overflowY: "auto",
            background: chatListBackground,
          }}
          height="100%"
        >
          {isLoading ? (
            <ChatlistSkeleton />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}

              newMessagesAlert={newMessageAlert}
              handleDeleteChat={handleDeleteChat}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
          {children}
        </Grid>

        <Grid
          md={4} lg={3} height="100%"
          sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: profileBackground }}
        >
          <Profile data={userData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default AppLayout;
