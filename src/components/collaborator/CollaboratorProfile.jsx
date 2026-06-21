"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    email: user?.email || "",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const email = encodeURIComponent(user?.email);
      const res = await fetch(`${API_URL}/api/collaborator/profile?email=${email}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (data.profile) {
        setProfile(data.profile);
        if (data.profile.image) {
          setImagePreview(data.profile.image);
        }
      } else {
        setProfile((prev) => ({
          ...prev,
          email: user?.email || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Profile not found is not an error for new users
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setProfile((prev) => ({
          ...prev,
          image: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!profile.skills.trim()) {
      setError("Skills are required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/api/collaborator/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          image: profile.image,
          skills: profile.skills,
          bio: profile.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <div className="mt-2 flex flex-col items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition hover:border-indigo-500">
              <Upload className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills * <span className="text-xs text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, MongoDB"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
}
