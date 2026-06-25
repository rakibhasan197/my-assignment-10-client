

export const getFeaturedStartups = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-startups`, {
    cache: "no-store",
  });

  return res.json();
};

export const getAllStartups = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/startup`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch startups error:", error);
    return [];
  }
};

export const getFeaturedOpportunities = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/featured-opportunities`,
    {
      cache: "no-store",
    }
  );

  return res.json();
};

export const getAllOpportunities = async (page = 1) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities?page=${page}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  return res.json();
};