import AdminDashboardLayout from "@/components/dashboard/layout/AdminDashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardLayout userName="Super Admin" userEmail="admin@acadexis.com">
      {children}
    </AdminDashboardLayout>
  );
}