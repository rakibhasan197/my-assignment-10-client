"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

const statusMeta = {
  Pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  Accepted: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  Rejected: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export default function MyApplications() {
  const { data: session } = useSession();
  const user = session?.user;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.email) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet(`/api/applications?email=${encodeURIComponent(user.email)}`);
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="inline mr-2 h-4 w-4 align-text-bottom" />
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center text-gray-600">
          No applications yet
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Opportunity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Startup
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => {
                const meta = statusMeta[app.status] || statusMeta.Pending;
                const Icon = meta.icon;
                return (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{app.opportunity_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.startup_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.applied_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {app.status}
                      </span>
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