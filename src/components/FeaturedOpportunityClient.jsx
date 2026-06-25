"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import OpportunityCard from "@/components/OpportunityCard";

const FeaturedOpportunityClient = ({ opportunities = [],totalPages = 1,
  currentPage = 1, }) => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("");

  const filteredOpportunities = opportunities.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.role_title?.toLowerCase().includes(query) ||
      item.startup_name?.toLowerCase().includes(query) ||
      item.required_skills?.toLowerCase().includes(query);

    const matchesWorkType =
      !workType || item.work_type === workType;

    return matchesSearch && matchesWorkType;
  });

  return (
    <div className="my-10 container mx-auto">
      <h2 className="text-3xl text-center my-5 font-bold">
        Featured All Opportunity
      </h2>

      <h1 className="text-center mb-4">
        Current Page: {page}
      </h1>

      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by role, startup or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />

        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Work Types</option>

          {[...new Set(opportunities.map((o) => o.work_type))]
            .filter(Boolean)
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>

     
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No opportunities found
          </div>
        )}
      </div>

      <div className="flex justify-center mt-10">
  <table className="table-auto border-collapse">
    <tbody>
      <tr>
        {[...Array(totalPages || 1)].map((_, index) => {
          const page = index + 1;

          return (
            <td key={page} className="p-2">
              <a
                href={`/opportunities?page=${page}`}
                className={`px-4 py-2 border rounded cursor-pointer ${
                  currentPage === page
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {page}
              </a>
            </td>
          );
        })}
      </tr>
    </tbody>
  </table>
</div>
    </div>
  );
};

export default FeaturedOpportunityClient;