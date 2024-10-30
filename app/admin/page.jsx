import dynamic from 'next/dynamic';
const AdminLogin = dynamic(()=>import('./AdminLogin'),{ssr: false});

const page = () => {
  return (
    <AdminLogin />
  )
}

export default page;

export const metadata = {
    title: "Admin",
    description: "Admin panel",
  }