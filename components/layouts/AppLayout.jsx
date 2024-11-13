"use client";
import Header from "@/components/layouts/Header";
import { LoadingComponent } from "@/components/LoadingsComponent/Loading";
import ChatList from "@/components/specific/ChatList";
import Profile from "@/components/specific/Profile";
import { chatBackground } from "@/constants/color";
import { useMyChatsQuery } from "@/redux/RTK-query/api/api";
import { CssBaseline, Drawer, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ChatlistSkeleton from "../LoadingsComponent/ChatlistSkeleton";
import { getSocket } from "@/socket";
import { setIsMobileMenu } from "@/redux/reducers/miscSlice";
import useSocketEvents from "@/hooks/useSocketEvents";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "@/constants/events";
import { increamentNotificaton, setNewMessageAlert } from "@/redux/reducers/chat";
import { getOrSaveFromStorage } from "@/utils/feature";
import { revalidatePath } from "next/cache";

const AppLayout = ({ children }) => {
  const { chatId } = useParams();
  const { status, data: userData } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const socket = getSocket();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { isLoading, data, refetch } = useMyChatsQuery();
  const isMobileMenu = useSelector(state => state.misc.isMobileMenu);
  const { newMessageAlert } = useSelector(state => state.chat);


  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login!");
      router.push("/login");
    } else if (status === "authenticated" && !welcomeShown) {
      setWelcomeShown(true);
      toast.success(`Welcome back ${userData.user.name}`);
    }
  }, [status, welcomeShown, userData, router]);


  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlert })
  }, [newMessageAlert])

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("Delete chat:", _id, groupChat);
  };

  const newMessageAlertHandler = useCallback((data) => {
    if (data.chatId === chatId) return;
    dispatch(setNewMessageAlert(data));
  }, [chatId])

  const newRequestHandler = useCallback((data) => {
    if (userData?.user?.id !== data.userId) return;

    dispatch(increamentNotificaton());
  }, [])
  const refetchListener = useCallback((data) => {
    console.log("refetch working ", data);
    refetch();
  }, [refetch])

  const eventHandlers = {
    [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
    [NEW_REQUEST]: newRequestHandler,
    [REFETCH_CHATS]: refetchListener
  };
  const handleMobileClose = () => dispatch(setIsMobileMenu(false));

  useSocketEvents(socket, eventHandlers);

  // console.log(socket);
  if (status === "loading") return <LoadingComponent />;
  if (status === "unauthenticated") return null;

  return (
    <div onContextMenu={(e) => { /* e.preventDefault(); */ }}>
      <CssBaseline />
      <Header userData={userData} />


      <Drawer open={isMobileMenu} onClose={handleMobileClose}>
        {isLoading ? (
          <ChatlistSkeleton />
        ) : (<ChatList
          w="70vw"
          chats={data?.chats}
          chatId={chatId}
          handleDeleteChat={handleDeleteChat}
          newMessagesAlert={newMessageAlert}
        />)}
      </Drawer>


      <Grid container height="calc(100vh - 4rem)">
        <Grid
          item sm={4} md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            bgcolor: "ButtonShadow",
            overflowY: "auto",
            background: chatBackground,
          }}
          height="100%"
        >
          {isLoading ? (
            <ChatlistSkeleton />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              onlineUsers={["1", "2", "3", "4"]}
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
          sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.8)" }}
        >
          <Profile data={userData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default AppLayout;
