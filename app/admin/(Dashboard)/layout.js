"use client";
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useState } from "react";

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

const handleLogout = () => {
  console.log("logout");
};

const isAdmin = true;

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  const handleClose = () => {
    setIsMobile(false);
  };

  if (!isAdmin) return router.push("/admin");

  return (
    <html lang="en">
      <body>
        <CssBaseline />
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
              zIndex:9999
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
              zIndex:0,
              opacity:0,
              pointerEvents:'none',
              width:'100%'
            }}
          >
          </Grid>
          <Grid item xs={12} md={8} lg={9} bgcolor={"#f5f5f5"}>
            {children}
          </Grid>
          <Drawer open={isMobile} onClose={handleClose}>
            <Sidebar w={"50vw"} />
          </Drawer>
        </Grid>
      </body>
    </html>
  );
}

const Sidebar = ({ w = "100%" }) => {
  const location = usePathname();
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
              iddisplay: "block",
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
                padding: "1rem 2rem",
                display: "grid",
                gridTemplateColumns: "1fr 3fr 1fr",
              }}
            >
              {tab.icon}
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {tab.label}
              </Typography>
            </Stack>
          </Link>
        ))}
        <Link
          href={"/admin"}
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
        </Link>
      </Stack>
    </Stack>
  );
};
