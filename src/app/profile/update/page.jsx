"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [isPending, router, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const { error } = await authClient.updateUser({
      name: formData.get("name"),
      image: formData.get("image"),
      role: formData.get("role"),
    });

    if (error) {
      setMessage(error.message || "Profile update failed");
      return;
    }

    setMessage("Profile updated successfully");
    router.refresh();
  };

  if (isPending || !user) {
    return <div className="mx-auto max-w-lg px-4 py-12">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-950">Update Profile</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-800">
            Name
            <input
              name="name"
              defaultValue={user.name || ""}
              required
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-600"
            />
          </label>

          <label className="block text-sm font-medium text-gray-800">
            Profile Image URL
            <input
              name="image"
              defaultValue={user.image || ""}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-600"
            />
          </label>

          <label className="block text-sm font-medium text-gray-800">
            Role
            <select
              name="role"
              defaultValue={user.role || "founder"}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-600"
            >
              <option value="founder">Founder</option>
              <option value="collaborator">Collaborator</option>
            </select>
          </label>

          {message ? (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
