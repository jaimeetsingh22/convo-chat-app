import Provider from "@/components/Provider"
import { CssBaseline } from "@mui/material"


export default function RootLayout({ children }) {

  
  return (
    <html lang="en">
      <CssBaseline />
      <body>
        <Provider>
        {children}
        </Provider>
        </body>
    </html>
  )
}
