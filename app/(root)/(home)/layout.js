import AppLayout from "@/components/layouts/AppLayout";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CssBaseline />
        <Toaster position="bottom-center" />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
