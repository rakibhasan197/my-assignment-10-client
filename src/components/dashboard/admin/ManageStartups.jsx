"use client";

import { useEffect, useState } from "react";

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);

  const fetchStartups = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/startups`);
    const data = await res.json();
    setStartups(data);
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const approveStartup = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/startups/${id}/approve`, {
      method: "PATCH",
    });
    fetchStartups();
  };

  const deleteStartup = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/startups/${id}`, {
      method: "DELETE",
    });
    fetchStartups();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr>
            <th>Startup</th>
            <th>Industry</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {startups.map((s) => (
            <tr key={s._id} className="border-t">
              <td>{s.startup_name}</td>
              <td>{s.industry}</td>
              <td>{s.status}</td>
              <td className="space-x-2">
                <button onClick={() => approveStartup(s._id)} className="bg-blue-500 text-white px-2">
                  Approve
                </button>
                <button onClick={() => deleteStartup(s._id)} className="bg-red-500 text-white px-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}