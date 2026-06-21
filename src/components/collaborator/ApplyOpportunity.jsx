"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ApplyOpportunity() {
  const { data: session } = useSession();
  const user = session?.user;

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    opportunityId: "",
    applicantEmail: user?.email || "",
    portfolioLink: "",
    motivationMessage: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        applicantEmail: user.email,
      }));
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/opportunities/all`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch opportunities");
      }

      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.opportunityId) {
      setError("Please select an opportunity");
      return;
    }

    if (!formData.portfolioLink.trim()) {
      setError("Portfolio link is required");
      return;
    }

    if (!formData.motivationMessage.trim()) {
      setError("Motivation message is required");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_URL}/api/applications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunity_id: formData.opportunityId,
          applicant_email: formData.applicantEmail,
          portfolio_link: formData.portfolioLink,
          motivation_message: formData.motivationMessage,
          status: "Pending",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      setSuccess("Application submitted successfully!");
      setFormData({
        opportunityId: "",
        applicantEmail: user?.email || "",
        portfolioLink: "",
        motivationMessage: "",
      });

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Opportunity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Opportunity *
          </label>
          <select
            name="opportunityId"
            value={formData.opportunityId}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Choose an opportunity...</option>
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.role_title} - {opp.startup_name}
              </option>
            ))}
          </select>
        </div>

        {/* Email Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            value={formData.applicantEmail}
            disabled
            className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
          />
        </div>

        {/* Portfolio Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio Link *
          </label>
          <input
            type="url"
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleChange}
            placeholder="https://example.com/portfolio"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Motivation Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Motivation Message *
          </label>
          <textarea
            name="motivationMessage"
            value={formData.motivationMessage}
            onChange={handleChange}
            placeholder="Tell us why you're interested in this opportunity..."
            rows="5"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
}
