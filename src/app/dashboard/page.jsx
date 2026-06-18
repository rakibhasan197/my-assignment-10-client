"use client";

import Link from "next/link";
import { useState } from "react";
import { Filter, UserRound } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const filters = ["Founder", "Collaborator", "Admin"];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [activeFilter, setActiveFilter] = useState("Founder");
  const user = session?.user;

  if (isPending) {
    return <div className="mx-auto max-w-5xl px-4 py-12">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border bg-white p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">Please login to view your dashboard.</p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Signed in as {user.name} {user.role ? `(${user.role})` : ""}
          </p>
        </div>

        <Link
          href="/profile/update"
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
        >
          <UserRound className="h-4 w-4" />
          Update Profile
        </Link>
      </div>

      <div className="mt-8 rounded-lg border bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            Filter
          </span>

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                activeFilter === filter
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-5">
          <h2 className="font-semibold text-gray-950">{activeFilter} items</h2>
          <p className="mt-2 text-sm text-gray-600">
            This dashboard section is ready for filtered startup or opportunity data.
          </p>
        </div>
      </div>
    </div>
  );
}
