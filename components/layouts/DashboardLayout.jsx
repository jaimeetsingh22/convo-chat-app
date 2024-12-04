"use client";
import { logoutAdmin, setAdmin } from "@/redux/reducers/auth";
// import { setAdmin } from "@/redux/reducers/auth";
// import { getAdmin, logOutAdmin } from "@/redux/thunks/adminAuth";
import { fetchAdmin, logoutAdmin as logoutAdminApi } from "@/utils/adminAuthApi";
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Group,
  ManageAccounts,
  Menu as MenuIcon,
  Message,
} from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const adminTabs = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Users",
    path: "/admin/users-management",
    icon: <ManageAccounts />,
  },
  {
    label: "Chats",
    path: "/admin/chats-management",
    icon: <Group />,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: <Message />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  
  const router = useRouter();
  const location = usePathname();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const data = await logoutAdminApi();
      if (data.success) {
        toast.success(data.message);
        dispatch(logoutAdmin());
        router.push("/admin");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Stack
      width={w}
      direction={"column"}
      p={"3rem"}
      height={"100vh"}
      overflow={"none"}
      spacing={"3rem"}
    >
      <Typography variant="h5">CONVO!</Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab, idx) => (
          <Link
            href={tab.path}
            key={tab.path}
            style={{
              textDecoration: "none",
              color: "black",
              display: "block",
              
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={"1rem"}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                // borderBottom:location === tab.path ? "2px solid black" : "none",
                backgroundColor: location === tab.path ? "#f6f6f6" : "unset",
                boxShadow:
                  location === tab.path ? "-3px 6px 2px black" : "unset",
                "&:hover": {
                  backgroundColor: "#f6f6f6",
                },
                borderRadius: "2rem",
                padding: "1rem 1rem",
                display: "grid",
                gridTemplateColumns: "1fr 3fr 1fr",
                width:{xs:"10rem",md:"auto"}
              }}
            >
              {tab.icon}
              <Typography
                sx={{
                  fontSize: {xs:"14px",lg:"1.1rem"},
                  fontWeight: "bold",
                }}
              >
                {tab.label}
              </Typography>
            </Stack>
          </Link>
        ))}
        <div

          style={{
            textDecoration: "none",
            color: "black",
            width: "100%",
            display: "block",
          }}
          onClick={handleLogout}
        >
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"1rem"}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
              borderRadius: "2rem",
              color: "black",
              padding: "1rem 2rem",
            }}
          >
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
};

export default function DashboardLayout({ children }) {
  const { isAdmin } = useSelector(state => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(Date.now() + 15 * 60 * 1000);
  const router = useRouter();
  const dispatch = useDispatch();

 

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  const handleClose = () => {
    setIsMobile(false);
  };

  useEffect(() => {
    console.log(isAdmin);
    if (!isAdmin) return router.push("/admin");
  }, [isAdmin,router]);

 

  useEffect(()=>{
    const fetchadmin= async ()=>{
      const res = await fetchAdmin();
      console.log(res);
    }
    fetchadmin();
  },[]);

  useEffect(() => {
    const checkTokenExpiry = async () => {
      if (Date.now() > tokenExpiry) {
        // Token expired, log out the user
        try {
          const { data } = await axios.get("/api/admin/logout", { withCredentials: true });
          if (data) {
            toast.error("Session expired!");
            dispatch(setAdmin(false));
            router.push("/admin");
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    };
  
    const interval = setInterval(checkTokenExpiry, 1000);
  
    return () => clearInterval(interval);
  }, [tokenExpiry, dispatch, router]);
  if (!isAdmin) return null;

  return (
    <>
      <div>
        <Toaster />
        <NextTopLoader showSpinner={false} />
        <Grid container minHeight={"100vh"} position={'relative'}>
          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              position: "fixed",
              top: "1rem",
              right: "0.9rem",
              zIndex: 1000,

            }}
          >
            <IconButton
              sx={{
                color: "#fff",
                borderRadius: "50%",
                background: "rgb(0,0,0)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}
              onClick={handleMobile}
            >
              {isMobile ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              height: "100vh",
              position: "fixed",
              zIndex: 9999
            }}
          >
            <Sidebar />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              zIndex: 0,
              opacity: 0,
              pointerEvents: 'none',
              width: '100%'
            }}
          >
          </Grid>
          <Grid item xs={12} md={8} lg={9} bgcolor={"#f5f5f5"}>
            {children}
          </Grid>
          <Drawer open={isMobile} onClose={handleClose}>
            <Sidebar w={"60vw"} />
          </Drawer>
        </Grid>
      </div>
    </>
  );
}


