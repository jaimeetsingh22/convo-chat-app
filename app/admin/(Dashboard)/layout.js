import DashboardLayout from "@/components/layouts/DashboardLayout";

export default async function RootLayout({ children }) {

  return (
    <>
      <DashboardLayout >{children}</DashboardLayout>
    </>
  );
}
