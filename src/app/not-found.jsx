"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6">
      <div className="max-w-xl text-center">
        {/* Illustration */}
        <div className="mb-8">
          <h1 className="text-[120px] font-extrabold text-indigo-600 opacity-20">
            404
          </h1>
        </div>

        {/* Content */}
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Oops! Page Not Found
        </h2>

        <p className="mb-8 text-lg text-gray-600">
          The page you are looking for doesn't exist or has been moved.
          Please return to the homepage.
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            <Home className="h-5 w-5" />
            Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}