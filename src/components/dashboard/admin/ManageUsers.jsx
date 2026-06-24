"use client";

import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/block`, {
      method: "PATCH",
    });
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/unblock`, {
      method: "PATCH",
    });
    fetchUsers();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isBlocked ? "Blocked" : "Active"}</td>
              <td className="space-x-2">
                <button onClick={() => blockUser(u._id)} className="px-2 py-1 bg-red-500 text-white">
                  Block
                </button>
                <button onClick={() => unblockUser(u._id)} className="px-2 py-1 bg-green-500 text-white">
                  Unblock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}