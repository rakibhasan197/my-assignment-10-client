"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

const statusColors = {
  Pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: Clock },
  Accepted: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle2 },
  Rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
};

export default function MyApplications() {
  const { data: session } = useSession();
  const user = session?.user;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const email = encodeURIComponent(user?.email);
      const res = await fetch(`${API_URL}/api/applications?email=${email}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-gray-600">No applications yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Startup
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const statusConfig = statusColors[app.status] || statusColors.Pending;
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={app._id}
                    className="border-b border-gray-200 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {app.opportunity_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {app.startup_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium w-fit ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {app.status}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
