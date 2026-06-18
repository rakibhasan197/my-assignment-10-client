"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-950">Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back to StartupForge.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-800">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-600"
            />
          </label>

          <label className="block text-sm font-medium text-gray-800">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-600"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
