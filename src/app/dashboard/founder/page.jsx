"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Plus,
  Save,
  Trash2,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "startup", label: "My Startup", icon: BriefcaseBusiness },
  { id: "add", label: "Add Opportunity", icon: Plus },
  { id: "manage", label: "Manage Opportunities", icon: ClipboardList },
  { id: "applications", label: "Applications", icon: UsersRound },
];

const emptyStartup = {
  startup_name: "",
  logo: "",
  industry: "",
  description: "",
  funding_stage: "",
};

const emptyOpportunity = {
  startup_id: "",
  startup_name: "",
  role_title: "",
  required_skills: "",
  work_type: "",
  commitment_level: "",
  deadline: "",
  image: "",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClass = "block text-sm font-medium text-gray-700";

export default function FounderHome() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const email = user?.email;
  const isFounder = user?.role === "founder" || user?.role === "Founder";

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    acceptedMembers: 0,
  });
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [startupForm, setStartupForm] = useState(emptyStartup);
  const [opportunityForm, setOpportunityForm] = useState(emptyOpportunity);
  const [editingStartupId, setEditingStartupId] = useState("");
  const [editingOpportunityId, setEditingOpportunityId] = useState("");

  const apiRequest = async (path, options = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const loadDashboard = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setErrorMessage("");
      const query = encodeURIComponent(email);
      const [overview, startupList, opportunityList, applicationList] =
        await Promise.all([
          apiRequest(`/api/founder/overview?email=${query}`),
          apiRequest(`/api/founder/startup?email=${query}`),
          apiRequest(`/api/founder/opportunities?email=${query}`),
          apiRequest(`/api/founder/applications?email=${query}`),
        ]);

      setStats(overview || {});
      setStartups(Array.isArray(startupList) ? startupList : []);
      setOpportunities(Array.isArray(opportunityList) ? opportunityList : []);
      setApplications(Array.isArray(applicationList) ? applicationList : []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && email) loadDashboard();
  }, [isPending, email]);

  const success = (text) => {
    setMessage(text);
    setErrorMessage("");
    window.setTimeout(() => setMessage(""), 2500);
  };

  const changeStartup = (e) => {
    setStartupForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const changeOpportunity = (e) => {
    const { name, value } = e.target;
    if (name === "startup_id") {
      const startup = startups.find((item) => item._id === value);
      setOpportunityForm((current) => ({
        ...current,
        startup_id: value,
        startup_name: startup?.startup_name || "",
      }));
      return;
    }
    setOpportunityForm((current) => ({ ...current, [name]: value }));
  };

  const resetStartup = () => {
    setStartupForm(emptyStartup);
    setEditingStartupId("");
  };

  const resetOpportunity = () => {
    setOpportunityForm(emptyOpportunity);
    setEditingOpportunityId("");
  };

  const submitStartup = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...startupForm, founder_email: email };
      if (editingStartupId) {
        await apiRequest(`/api/founder/startup/${editingStartupId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        success("Startup updated successfully.");
      } else {
        await apiRequest("/api/founder/startup", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        success("Startup created successfully.");
      }
      resetStartup();
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editStartup = (startup) => {
    setStartupForm({
      startup_name: startup.startup_name || "",
      logo: startup.logo || "",
      industry: startup.industry || "",
      description: startup.description || "",
      funding_stage: startup.funding_stage || "",
    });
    setEditingStartupId(startup._id);
    setActiveTab("startup");
  };

  const deleteStartup = async (id) => {
    try {
      setSaving(true);
      await apiRequest(`/api/founder/startup/${id}`, { method: "DELETE" });
      success("Startup deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const submitOpportunity = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...opportunityForm, founder_email: email };
      if (editingOpportunityId) {
        await apiRequest(`/api/founder/opportunities/${editingOpportunityId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        success("Opportunity updated successfully.");
      } else {
        await apiRequest("/api/founder/opportunities", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        success("Opportunity added successfully.");
      }
      resetOpportunity();
      await loadDashboard();
      setActiveTab("manage");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const editOpportunity = (opportunity) => {
    setOpportunityForm({
      startup_id: opportunity.startup_id || "",
      startup_name: opportunity.startup_name || "",
      role_title: opportunity.role_title || "",
      required_skills: opportunity.required_skills || "",
      work_type: opportunity.work_type || "",
      commitment_level: opportunity.commitment_level || "",
      deadline: opportunity.deadline || "",
      image: opportunity.image || "",
    });
    setEditingOpportunityId(opportunity._id);
    setActiveTab("add");
  };

  const deleteOpportunity = async (id) => {
    try {
      setSaving(true);
      await apiRequest(`/api/founder/opportunities/${id}`, { method: "DELETE" });
      success("Opportunity deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      setSaving(true);
      await apiRequest(`/api/founder/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      success(`Application ${status.toLowerCase()}.`);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) return <LoadingScreen />;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-950">Dashboard</h1>
        <p className="mt-3 text-gray-600">Please login to view your dashboard.</p>
      </section>
    );
  }

  if (!isFounder) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-950">Founder Dashboard</h1>
        <p className="mt-3 text-gray-600">This dashboard is available for founder accounts.</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-600">Founder Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950">
              Welcome, {user?.name || "Founder"}
            </h1>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            {email}
          </div>
        </div>

        {(message || errorMessage) && (
          <div
            className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
              errorMessage
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {errorMessage || message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <nav className="grid gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-h-[620px] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <>
                {activeTab === "overview" && <Overview stats={stats} />}
                {activeTab === "startup" && (
                  <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
                    <StartupForm
                      form={startupForm}
                      isEditing={Boolean(editingStartupId)}
                      saving={saving}
                      onChange={changeStartup}
                      onSubmit={submitStartup}
                      onCancel={resetStartup}
                    />
                    <StartupList
                      startups={startups}
                      saving={saving}
                      onEdit={editStartup}
                      onDelete={deleteStartup}
                    />
                  </div>
                )}
                {activeTab === "add" && (
                  <OpportunityForm
                    form={opportunityForm}
                    startups={startups}
                    isEditing={Boolean(editingOpportunityId)}
                    saving={saving}
                    onChange={changeOpportunity}
                    onSubmit={submitOpportunity}
                    onCancel={resetOpportunity}
                  />
                )}
                {activeTab === "manage" && (
                  <OpportunityList
                    opportunities={opportunities}
                    saving={saving}
                    onEdit={editOpportunity}
                    onDelete={deleteOpportunity}
                  />
                )}
                {activeTab === "applications" && (
                  <ApplicationList
                    applications={applications}
                    saving={saving}
                    onStatusChange={updateApplicationStatus}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function LoadingScreen() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </section>
  );
}

function Overview({ stats }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-950">Overview</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Opportunities" value={stats.totalOpportunities} icon={ClipboardList} />
        <StatCard title="Total Applications" value={stats.totalApplications} icon={UsersRound} />
        <StatCard title="Accepted Members" value={stats.acceptedMembers} icon={CheckCircle2} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-950">{value || 0}</p>
    </div>
  );
}

function StartupForm({ form, isEditing, saving, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-950">{isEditing ? "Update Startup" : "Create Startup"}</h2>
        {isEditing && <CancelButton onClick={onCancel} />}
      </div>
      <div className="mt-5 grid gap-4">
        <TextInput label="Startup Name" name="startup_name" value={form.startup_name} onChange={onChange} required />
        <TextInput label="Logo URL" name="logo" type="url" value={form.logo} onChange={onChange} required />
        <TextInput label="Industry" name="industry" value={form.industry} onChange={onChange} required />
        <label className={labelClass}>
          Funding Stage
          <select className={inputClass} name="funding_stage" value={form.funding_stage} onChange={onChange} required>
            <option value="">Select stage</option>
            <option value="Idea">Idea</option>
            <option value="MVP">MVP</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Bootstrapped">Bootstrapped</option>
          </select>
        </label>
        <label className={labelClass}>
          Description
          <textarea className={`${inputClass} min-h-28 resize-y`} name="description" value={form.description} onChange={onChange} required />
        </label>
      </div>
      <SubmitButton saving={saving} text={isEditing ? "Update Startup" : "Create Startup"} />
    </form>
  );
}

function StartupList({ startups, saving, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-950">Manage Startup</h2>
      <div className="mt-5 grid gap-4">
        {startups.length === 0 ? <EmptyState text="No startup found." /> : startups.map((startup) => (
          <article key={startup._id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="font-semibold text-gray-950">{startup.startup_name}</h3>
                <p className="mt-1 text-sm text-gray-600">{startup.industry} | {startup.funding_stage}</p>
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{startup.description}</p>
              </div>
              <ActionButtons saving={saving} onEdit={() => onEdit(startup)} onDelete={() => onDelete(startup._id)} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function OpportunityForm({ form, startups, isEditing, saving, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-950">{isEditing ? "Update Opportunity" : "Add Opportunity"}</h2>
        {isEditing && <CancelButton onClick={onCancel} />}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Startup
          <select className={inputClass} name="startup_id" value={form.startup_id} onChange={onChange} required>
            <option value="">Select startup</option>
            {startups.map((startup) => <option key={startup._id} value={startup._id}>{startup.startup_name}</option>)}
          </select>
        </label>
        <TextInput label="Role Title" name="role_title" value={form.role_title} onChange={onChange} required />
        <TextInput label="Required Skills" name="required_skills" value={form.required_skills} onChange={onChange} required />
        <label className={labelClass}>
          Work Type
          <select className={inputClass} name="work_type" value={form.work_type} onChange={onChange} required>
            <option value="">Select work type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </label>
        <label className={labelClass}>
          Commitment Level
          <select className={inputClass} name="commitment_level" value={form.commitment_level} onChange={onChange} required>
            <option value="">Select commitment</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Equity-based">Equity-based</option>
          </select>
        </label>
        <TextInput label="Deadline" name="deadline" type="date" value={form.deadline} onChange={onChange} required />
        <TextInput label="Image URL" name="image" type="url" value={form.image} onChange={onChange} />
      </div>
      <SubmitButton saving={saving} text={isEditing ? "Update Opportunity" : "Add Opportunity"} />
    </form>
  );
}

function OpportunityList({ opportunities, saving, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-950">Manage Opportunities</h2>
      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
        {opportunities.length === 0 ? <EmptyState text="No opportunity found." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Startup</th>
                  <th className="px-4 py-3 font-semibold">Skills</th>
                  <th className="px-4 py-3 font-semibold">Work Type</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {opportunities.map((opportunity) => (
                  <tr key={opportunity._id}>
                    <td className="px-4 py-3 font-medium text-gray-950">{opportunity.role_title}</td>
                    <td className="px-4 py-3 text-gray-600">{opportunity.startup_name}</td>
                    <td className="px-4 py-3 text-gray-600">{opportunity.required_skills}</td>
                    <td className="px-4 py-3 text-gray-600">{opportunity.work_type}</td>
                    <td className="px-4 py-3 text-gray-600">{opportunity.deadline}</td>
                    <td className="px-4 py-3"><ActionButtons saving={saving} onEdit={() => onEdit(opportunity)} onDelete={() => onDelete(opportunity._id)} /></td>
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

function ApplicationList({ applications, saving, onStatusChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-950">Applications</h2>
      <div className="mt-5 grid gap-4">
        {applications.length === 0 ? <EmptyState text="No application found." /> : applications.map((application) => {
          const status = application.status || application.Status || "Pending";
          return (
            <article key={application._id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-950">{application.applicant_email || application.Applicant_email}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-gray-700">{status}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Opportunity: {application.opportunity_name || application.Opportunity_name || application.opportunity_id || application.Opportunity_id}</p>
                  <p className="mt-2 text-sm text-gray-600">Portfolio: {application.portfolio_link || application.Portfolio_link || "Not provided"}</p>
                  <p className="mt-3 text-sm text-gray-700">{application.motivation || application.Motivation || application.motivation_message || "No motivation message."}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" disabled={saving} onClick={() => onStatusChange(application._id, "Accepted")} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
                    <CheckCircle2 className="h-4 w-4" /> Accept
                  </button>
                  <button type="button" disabled={saving} onClick={() => onStatusChange(application._id, "Rejected")} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TextInput({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} name={name} type={type} value={value} onChange={onChange} required={required} />
    </label>
  );
}

function SubmitButton({ saving, text }) {
  return (
    <button type="submit" disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
      <Save className="h-4 w-4" /> {text}
    </button>
  );
}

function CancelButton({ onClick }) {
  return <button type="button" onClick={onClick} className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>;
}

function ActionButtons({ saving, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit} className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Edit</button>
      <button type="button" disabled={saving} onClick={onDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50 px-4 py-10 text-center text-sm text-gray-600">{text}</div>;
}
