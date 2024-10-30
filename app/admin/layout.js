import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <CssBaseline/>
        {children}
        </body>
    </html>
  )
}
