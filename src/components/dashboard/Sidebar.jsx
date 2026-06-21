"use client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  ClipboardList,
  UsersRound,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "startup", label: "My Startup", icon: BriefcaseBusiness },
  { id: "add", label: "Add Opportunity", icon: Plus },
  { id: "manage", label: "Manage Opportunities", icon: ClipboardList },
  { id: "applications", label: "Applications", icon: UsersRound },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="h-fit rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <nav className="grid gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}