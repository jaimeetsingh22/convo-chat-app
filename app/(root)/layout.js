import Layouts from "@/components/layouts/Layouts";
import StoreProvider from "@/components/layouts/StoreProvider";
import { SocketProvider } from "@/socket";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <SocketProvider>
            <StoreProvider>
              <Toaster />
              <Layouts>{children}</Layouts>
            </StoreProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
