import { Container, CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <CssBaseline />
          <Toaster />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
