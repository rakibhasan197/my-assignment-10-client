"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Users,
  User,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

import BrowseOpportunities from "@/components/dashboard/collaborator/BrowseOpportunities";
import ApplyOpportunity from "@/components/dashboard/collaborator/ApplyOpportunity";
import MyApplications from "@/components/dashboard/collaborator/MyApplications";
import CollaboratorProfile from "@/components/dashboard/collaborator/CollaboratorProfile";
import PremiumPayment from "@/components/dashboard/collaborator/PremiumPayment";

const tabs = [
  { id: "browse", label: "Browse Opportunities", icon: BriefcaseBusiness },
  { id: "apply", label: "Apply", icon: FileText },
  { id: "applications", label: "My Applications", icon: Users },
  { id: "profile", label: "Profile", icon: User },
  { id: "premium", label: "Premium", icon: CreditCard },
];

export default function CollaboratorDashboard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState("browse");

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-3xl bg-white p-10 shadow-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Please sign in to continue
          </h1>
          <a
            href="/login"
            className="mt-6 inline-flex rounded-2xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center gap-4">
          <LayoutDashboard className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Collaborator Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, {user.name || user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "browse" && <BrowseOpportunities />}
        {activeTab === "apply" && <ApplyOpportunity />}
        {activeTab === "applications" && <MyApplications />}
        {activeTab === "profile" && <CollaboratorProfile />}
        {activeTab === "premium" && <PremiumPayment />}
      </main>
    </div>
  );
}