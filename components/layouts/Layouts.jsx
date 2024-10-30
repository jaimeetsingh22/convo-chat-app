"use client";
import Header from "@/components/layouts/Header";
import { LoadingComponent } from "@/components/LoadingsComponent/Loading";
import ChatList from "@/components/specific/ChatList";
import Profile from "@/components/specific/Profile";
import { chatBackground } from "@/constants/color";
import { sampleChats } from "@/constants/sampleData";
import { useError } from "@/hooks/hook";
import { setIsMobileMenu } from "@/redux/reducers/miscSlice";
import { useMyChatsQuery } from "@/redux/RTK-query/api/api";
import { CssBaseline, Drawer, Grid, Skeleton } from "@mui/material";
import { SessionProvider, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ChatlistSkeleton from "../LoadingsComponent/ChatlistSkeleton";
import { getSocket } from "@/socket";

const Layouts = ({ children }) => {
  const params = useParams();
  const chatId = params.chatId;
  const dispatch = useDispatch();
  const { data: userData, status } = useSession();
  const router = useRouter();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { isLoading, isError, data, error, refetch } = useMyChatsQuery();

  const { isMobileMenu } = useSelector(state => state.misc);

  useEffect(() => {
    if (status === "authenticated" && !hasShownWelcome) {
      toast.success(`Welcome back ${userData.user.name}`);
      setHasShownWelcome(true);
    }
  }, [status, hasShownWelcome, userData]);

  const socket = getSocket();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please Login!");
      router.push("/login");
    }
  }, [status, router]); // Ensure redirect happens without additional state updates

  if (status === "loading") {
    return <LoadingComponent />;
  }

  if (status === "unauthenticated") {
    return null; // Ensure no content is rendered while redirecting
  }

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    console.log("delete chat", _id, groupChat);
  };

  const handleMobileClose = () => {
    dispatch(setIsMobileMenu(false));
  };

  return (
    <div onContextMenu={(e) => {
      // e.preventDefault()
    }
    }>
      <NextTopLoader showSpinner={false} />
      <CssBaseline />
      <Header />
      {
        isLoading ? (<ChatlistSkeleton />) : (
          <Drawer open={isMobileMenu} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        )
      }
      <Grid container height={"calc(100vh - 4rem)"}>
        <Grid item sm={4} md={3} sx={{ display: { xs: "none", sm: "block" }, bgcolor: "ButtonShadow", overflowY: "auto", background: chatBackground }} height={"100%"}>
          {isLoading ? (<ChatlistSkeleton />) : (<ChatList chats={data?.chats} chatId={chatId} onlineUsers={["1", "2", "3", "4"]} newMessagesAlert={[{ chatId, count: 4 }]} handleDeleteChat={handleDeleteChat} />)}
        </Grid>

        <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
          {children}
        </Grid>

        <Grid md={4} lg={3} height={"100%"} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.8)" }}>
          <Profile data={userData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Layouts;

