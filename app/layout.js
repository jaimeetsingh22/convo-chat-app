import { CssBaseline } from "@mui/material";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({ children }) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
