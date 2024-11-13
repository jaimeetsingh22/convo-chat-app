import StoreProvider from "@/components/layouts/StoreProvider";
import Provider from "@/components/Provider";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Toaster position="bottom-center" />
        {children}</body>
    </html>
  );
}
