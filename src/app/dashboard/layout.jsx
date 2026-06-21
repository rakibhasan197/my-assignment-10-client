import Sidebar from "@/components/dashboard/shared/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}