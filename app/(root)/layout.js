import StoreProvider from "@/components/layouts/StoreProvider";
import { SocketProvider } from "@/socket";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <>
        <SessionProvider>
          <StoreProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </StoreProvider>
        </SessionProvider>
    </>
  );
}
