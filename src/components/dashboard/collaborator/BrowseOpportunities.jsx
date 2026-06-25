"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWorkType, setFilterWorkType] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

  // ✅ FETCH DATA (FIXED)
useEffect(() => {
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities?page=${page}&limit=5`
      );

      if (!res.ok) {
        throw new Error("Failed to load opportunities");
      }

      const data = await res.json();

      setOpportunities(data.opportunities || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  fetchOpportunities();
}, [page]);
  // ✅ FILTER LOGIC
  const filtered = opportunities.filter((opp) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      opp.role_title?.toLowerCase().includes(query) ||
      opp.startup_name?.toLowerCase().includes(query) ||
      opp.required_skills?.toLowerCase().includes(query);

    const matchesWorkType =
      !filterWorkType || opp.work_type === filterWorkType;

    return matchesSearch && matchesWorkType;
  });

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* SEARCH + FILTER */}
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, startup, or skill"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={filterWorkType}
          onChange={(e) => setFilterWorkType(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All work types</option>

          {[...new Set(opportunities.map((opp) => opp.work_type))]
            .filter(Boolean)
            .map((workType) => (
              <option key={workType} value={workType}>
                {workType}
              </option>
            ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="inline mr-2 h-4 w-4 align-text-bottom" />
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center text-gray-600">
          No opportunities found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">

          {/* CARDS */}
          {filtered.map((opp) => (
            <button
              key={opp._id}
              type="button"
              onClick={() => setSelectedOpportunity(opp)}
              className="rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {opp.role_title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {opp.startup_name}
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {opp.work_type}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                {opp.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {opp.required_skills
                  ?.split(",")
                  .slice(0, 3)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </button>
          ))}
        </div>
      )}
      {totalPages > 1 && (
  <div className="mt-8 flex justify-center gap-2">
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page === 1}
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => {
      const pageNumber = index + 1;

      return (
        <button
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          className={`rounded-lg px-4 py-2 ${
            page === pageNumber
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {pageNumber}
        </button>
      );
    })}

    <button
      onClick={() =>
        setPage((prev) => Math.min(prev + 1, totalPages))
      }
      disabled={page === totalPages}
      className="rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      {/* MODAL */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-xl">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedOpportunity.role_title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedOpportunity.startup_name}
                </p>
              </div>

              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="mt-2">
                  {selectedOpportunity.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Required Skills
                  </h3>
                  <p className="mt-1">
                    {selectedOpportunity.required_skills}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Deadline</h3>
                  <p className="mt-1">
                    {selectedOpportunity.deadline
                      ? new Date(
                          selectedOpportunity.deadline
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Commitment
                  </h3>
                  <p className="mt-1">
                    {selectedOpportunity.commitment_level}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Work Type
                  </h3>
                  <p className="mt-1">
                    {selectedOpportunity.work_type}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOpportunity(null)}
              className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}