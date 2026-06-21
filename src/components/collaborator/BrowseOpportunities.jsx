"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/opportunities/all`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch opportunities");
      }

      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.role_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.startup_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !filterRole || opp.role_title === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by role, startup, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All Roles</option>
          {[...new Set(opportunities.map((o) => o.role_title))].map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-gray-600">No opportunities found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOpportunities.map((opp) => (
            <button
              key={opp._id}
              onClick={() => setSelectedOpportunity(opp)}
              className="rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-400 hover:shadow-md"
            >
              {opp.image && (
                <img
                  src={opp.image}
                  alt={opp.startup_name}
                  className="mb-3 h-32 w-full rounded-md object-cover"
                />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{opp.role_title}</h3>
                <p className="text-sm text-gray-600">{opp.startup_name}</p>
                <p className="line-clamp-2 text-xs text-gray-500">
                  {opp.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {opp.required_skills?.split(",").slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedOpportunity.role_title}
              </h2>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-lg font-semibold text-indigo-600">
              {selectedOpportunity.startup_name}
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="mt-1 text-gray-600">
                  {selectedOpportunity.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Required Skills</h3>
                  <p className="mt-1 text-gray-600">
                    {selectedOpportunity.required_skills}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Work Type</h3>
                  <p className="mt-1 text-gray-600">
                    {selectedOpportunity.work_type}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Commitment Level
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {selectedOpportunity.commitment_level}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Deadline</h3>
                  <p className="mt-1 text-gray-600">
                    {new Date(
                      selectedOpportunity.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOpportunity(null)}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
