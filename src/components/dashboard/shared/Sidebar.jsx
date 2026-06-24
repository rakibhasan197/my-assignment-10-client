"use client";

import {
  BriefcaseBusiness,
  FileText,
  Users,
  User,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

const tabs = [
  { id: "browse", label: "Browse Opportunities", icon: BriefcaseBusiness },
  { id: "apply", label: "Apply", icon: FileText },
  { id: "applications", label: "My Applications", icon: Users },
  { id: "profile", label: "Profile", icon: User },
  { id: "premium", label: "Premium", icon: CreditCard },
];

export default function Sidebar({ activeTab, setActiveTab, user }) {
  return (
    <aside className="w-72 border-r bg-white flex flex-col">

      {/* Header */}
      <div className="p-5 border-b flex items-center gap-2">
        <LayoutDashboard className="text-indigo-600" />
        <h1 className="font-bold text-lg">Dashboard</h1>
      </div>

      {/* User */}
      <div className="p-4 border-b text-sm text-gray-600">
        Welcome, <br />
        <span className="font-semibold text-gray-900">
          {user?.name || user?.email}
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}

      </nav>

    </aside>
  );
}