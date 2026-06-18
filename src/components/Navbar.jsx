"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Startups", href: "/startups" },
    { label: "Browse Opportunities", href: "/opportunities" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">

        {/* MAIN NAVBAR */}
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold text-indigo-600"
          >
            StartupForge
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-3 text-sm">

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg border border-gray-300 bg-white"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4 text-sm">

            {/* PUBLIC LINKS */}
            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* DIVIDER */}
            <div className="border-t"></div>

            {/* AUTH SECTION */}
            <div className="space-y-2 pt-2">

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;