"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return <div className="mx-auto max-w-3xl px-4 py-12">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {user ? (
          <>
            <div className="mt-5 space-y-2 text-gray-700">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role || "Not set"}</p>
            </div>
            <Link
              href="/profile/update"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-white"
            >
              Update Profile
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-gray-600">Please login to view your profile.</p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-white"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
