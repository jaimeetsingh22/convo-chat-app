import GroupsLoadingSkeleton from '@/components/LoadingsComponent/GroupLoading';
import dynamic from 'next/dynamic';
const Groups = dynamic(() => import('./Groups'), { ssr: false, loading: () => <GroupsLoadingSkeleton /> });


const page = () => {
  return <Groups />
}

export const metadata = {
  title: "Groups",
  description: "Chat Groups",
}

export default page