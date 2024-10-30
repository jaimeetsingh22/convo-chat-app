import dynamic from 'next/dynamic';
const Groups = dynamic(()=>import('./Groups'),{ssr: false});


const page = () => {
  return <Groups/>
}

export const metadata = {
    title: "Groups",
    description: "Chat Groups",
  }

export default page