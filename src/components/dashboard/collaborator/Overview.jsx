"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Clock3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Overview() {
  const { data: session } = useSession();
  const user = session?.user;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/applications/user/${user?.email}`
        );

        const data = await res.json();

        setApplications(data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchApplications();
    }
  }, [user]);

  const total = applications.length;

  const pending = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const approved = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const stats = [
    {
      title: "Total Applications",
      value: total,
      icon: Briefcase,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-indigo-100">
          {user?.name}
        </p>

        <p className="mt-4 text-sm text-indigo-100">
          Track your startup applications and profile
          progress from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-4xl font-bold">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`rounded-2xl p-3 ${item.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Recent Applications
        </h3>

        {applications.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No applications found.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Opportunity ID</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr
                    key={app._id}
                    className="border-b last:border-none"
                  >
                    <td className="py-3">
                      {app.opportunity_id}
                    </td>

                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          app.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : app.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}