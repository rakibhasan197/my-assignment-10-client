"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard/admin" },
    { name: "Manage Users", href: "/dashboard/admin/users" },
    { name: "Manage Startups", href: "/dashboard/admin/startups" },
    { name: "Transactions", href: "/dashboard/admin/transactions" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5 flex flex-col">
      
      {/* Logo / Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide">
          StartupForge
        </h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-500">
        © 2026 StartupForge
      </div>
    </div>
  );
}