'use client'

import { useRouter } from "next/navigation"

 
export default function GlobalError({ error, reset }) {
  const router = useRouter();
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={() =>( router.refresh() ) }>Try again</button>
      </body>
    </html>
  )
}