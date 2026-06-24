"use client";

import { useEffect, useState } from "react";

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`);
      const data = await res.json();
      setPayments(data);
    };

    fetchPayments();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-t">
              <td>{p.user_email}</td>
              <td>{p.amount}</td>
              <td>{p.payment_status}</td>
              <td>{new Date(p.paid_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}