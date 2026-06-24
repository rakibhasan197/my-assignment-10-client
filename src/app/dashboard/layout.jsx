"use client";

import Sidebar from "@/components/dashboard/admin/Sidebar";
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();

  const role = session?.user?.role;

  if (isPending) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar only for admin */}
      {role === "admin" && <Sidebar />}

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm min-h-full p-6">
          {children}
        </div>
      </main>

    </div>
  );
}