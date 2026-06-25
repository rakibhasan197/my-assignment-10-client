const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFeaturedStartups = async () => {
  const res = await fetch(`${BASE_URL}/api/featured-startups`, {
    cache: "no-store",
  });

  return res.json();
};

export const getAllStartups = async () => {
  const res = await fetch(`${BASE_URL}/api/startup`);

  return res.json();
};

export const getFeaturedOpportunities = async () => {
  const res = await fetch(
    `${BASE_URL}/api/featured-opportunities`,
    {
      cache: "no-store",
    }
  );

  return res.json();
};

export const getAllOpportunities = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/api/opportunities?page=${page}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  return res.json();
};