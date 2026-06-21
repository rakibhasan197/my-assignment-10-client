"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiGet, apiPost } from "@/lib/api";

export default function ApplyOpportunity() {
  const { data: session } = useSession();
  const user = session?.user;

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    opportunityId: "",
    portfolioLink: "",
    motivationMessage: "",
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/api/opportunities/all");
      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.opportunityId) return setError("Select an opportunity");
    if (!form.portfolioLink.trim()) return setError("Portfolio link is required");
    if (!form.motivationMessage.trim())
      return setError("Motivation message is required");

    try {
      setSubmitting(true);
      await apiPost("/api/applications", {
        opportunity_id: form.opportunityId,
        applicant_email: user.email,
        portfolio_link: form.portfolioLink,
        motivation_message: form.motivationMessage,
        status: "Pending",
      });
      setSuccess("Application submitted successfully!");
      setForm({ opportunityId: "", portfolioLink: "", motivationMessage: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {(error || success) && (
        <div
          className={`rounded-3xl p-4 text-sm ${
            error ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
          } border`}
        >
          {error ? error : success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opportunity
          </label>
          <select
            value={form.opportunityId}
            onChange={(e) => setForm({ ...form, opportunityId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select opportunity</option>
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.role_title} — {opp.startup_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio Link
          </label>
          <input
            value={form.portfolioLink}
            onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })}
            placeholder="https://portfolio.example.com"
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Motivation Message
          </label>
          <textarea
            rows={5}
            value={form.motivationMessage}
            onChange={(e) => setForm({ ...form, motivationMessage: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}