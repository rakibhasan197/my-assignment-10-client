"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  BriefcaseBusiness,
  FileText,
  Users,
  User,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

import BrowseOpportunities from "@/components/collaborator/BrowseOpportunities";
import ApplyOpportunity from "@/components/collaborator/ApplyOpportunity";
import MyApplications from "@/components/collaborator/MyApplications";
import CollaboratorProfile from "@/components/collaborator/CollaboratorProfile";
import PremiumPayment from "@/components/collaborator/PremiumPayment";

const tabs = [
  { id: "browse", label: "Browse Opportunities", icon: BriefcaseBusiness },
  { id: "apply", label: "Apply to Opportunity", icon: FileText },
  { id: "applications", label: "My Applications", icon: Users },
  { id: "profile", label: "Profile", icon: User },
  { id: "premium", label: "Premium Plan", icon: CreditCard },
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in to continue
          </h1>
          <a
            href="/login"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Collaborator Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user.name || user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition ${
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

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "browse" && <BrowseOpportunities />}
        {activeTab === "apply" && <ApplyOpportunity />}
        {activeTab === "applications" && <MyApplications />}
        {activeTab === "profile" && <CollaboratorProfile />}
        {activeTab === "premium" && <PremiumPayment />}
      </div>
    </div>
  );
}
