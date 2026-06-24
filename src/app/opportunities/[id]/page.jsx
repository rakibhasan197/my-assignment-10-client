"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import ApplyOpportunityModal from "@/components/ApplyOpportunityModal";
import Image from "next/image";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [portfolioLink, setPortfolioLink] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");

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

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    try {
      const applicationData = {
        opportunity_id: opportunity._id,
        applicant_email: session?.user?.email,
        portfolio_link: portfolioLink,
        motivation_message: motivationMessage,
        status: "Pending",
      };

      const res = await fetch(
        "http://localhost:8000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Application Submitted Successfully!");

        setPortfolioLink("");
        setMotivationMessage("");

        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

      <Image
        src={opportunity.image}
        alt={opportunity.role_title}
        className="w-full h-80 object-cover rounded-2xl"
        height={500}
        width={800}
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

        <div className="mt-8">
          <ApplyOpportunityModal
            opportunity={opportunity}
            session={session}
            portfolioLink={portfolioLink}
            setPortfolioLink={setPortfolioLink}
            motivationMessage={motivationMessage}
            setMotivationMessage={setMotivationMessage}
            handleApplySubmit={handleApplySubmit}
          />
        </div>

      </div>
    </div>
  );
}