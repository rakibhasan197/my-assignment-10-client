"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiGet, apiPost } from "@/lib/api";
import { imageUploader } from "@/lib/imageUpload";

export default function CollaboratorProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet(
        `/api/collaborator/profile?email=${encodeURIComponent(user.email)}`
      );
      if (data.profile) {
        setProfile({
          name: data.profile.name || "",
          image: data.profile.image || "",
          skills: data.profile.skills || "",
          bio: data.profile.bio || "",
        });
        setImagePreview(data.profile.image || "");
      }
    } catch (err) {
      // profile may not exist yet
    } finally {
      setLoading(false);
    }
  };

 const handleImage = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setSaving(true);
    setError("");

    const imageData = await imageUploader(file);

    setImagePreview(imageData.url);

    setProfile((prev) => ({
      ...prev,
      image: imageData.url,
    }));
  } catch (err) {
    console.error(err);
    setError("Image upload failed");
  } finally {
    setSaving(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile.name.trim()) return setError("Name is required");
    if (!profile.skills.trim()) return setError("Skills are required");

    try {
      setSaving(true);
      await apiPost("/api/collaborator/profile", {
        email: user.email,
        name: profile.name,
        image: profile.image,
        skills: profile.skills,
        bio: profile.bio,
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {(error || success) && (
        <div
          className={`rounded-3xl border p-4 text-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[160px_1fr] items-start">
          <div className="space-y-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-40 w-40 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-gray-200 bg-gray-100 text-gray-500">
                No image
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:border-indigo-500">
              <Upload className="h-4 w-4" />
              Upload Image
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <input
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder="JavaScript, React, UI/UX"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}