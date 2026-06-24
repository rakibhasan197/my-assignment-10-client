"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OpportunityDetailsPage() {
  const { id } = useParams();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/opportunities/${id}`
        );

        const data = await res.json();

        setOpportunity(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-20">
        Opportunity not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <img
        src={opportunity.image}
        alt={opportunity.role_title}
        className="w-full h-80 object-cover rounded-2xl"
      />

      <div className="mt-6">
        <h1 className="text-4xl font-bold">
          {opportunity.role_title}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {opportunity.startup_name}
        </p>

        <div className="mt-6 space-y-3">
          <p>
            <strong>Description:</strong>{" "}
            {opportunity.description}
          </p>

          <p>
            <strong>Required Skills:</strong>{" "}
            {opportunity.required_skills}
          </p>

          <p>
            <strong>Commitment Level:</strong>{" "}
            {opportunity.commitment_level}
          </p>

          <p>
            <strong>Work Type:</strong>{" "}
            {opportunity.work_type}
          </p>

          <p>
            <strong>Deadline:</strong>{" "}
            {opportunity.deadline}
          </p>
        </div>

        <button
          className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}