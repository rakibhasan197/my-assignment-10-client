"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";


import BrowseOpportunities from "@/components/dashboard/collaborator/BrowseOpportunities";
import ApplyOpportunity from "@/components/dashboard/collaborator/ApplyOpportunity";
import MyApplications from "@/components/dashboard/collaborator/MyApplications";
import CollaboratorProfile from "@/components/dashboard/collaborator/CollaboratorProfile";
import PremiumPayment from "@/components/dashboard/collaborator/PremiumPayment";
import Sidebar from "@/components/dashboard/shared/Sidebar";

export default function CollaboratorDashboard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("browse");

  if (isPending) return <p>Loading...</p>;

  if (!user) return <p>Please login</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">

        {activeTab === "browse" && <BrowseOpportunities />}
        {activeTab === "apply" && <ApplyOpportunity />}
        {activeTab === "applications" && <MyApplications />}
        {activeTab === "profile" && <CollaboratorProfile />}
        {activeTab === "premium" && <PremiumPayment />}

      </main>

    </div>
  );
}