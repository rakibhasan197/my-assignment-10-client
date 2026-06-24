"use client";

import { useEffect, useState } from "react";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Users" value={data.totalUsers} />
      <Card title="Startups" value={data.totalStartups} />
      <Card title="Opportunities" value={data.totalOpportunities} />
      <Card title="Revenue" value={`$${data.totalRevenue}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-4 shadow rounded-xl border">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}