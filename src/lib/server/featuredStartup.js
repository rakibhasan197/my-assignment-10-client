// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFeaturedStartups = async () => {
  const res = await fetch(`http://localhost:8000/api/featured-startups`, {
    cache: "no-store",
  });

  return res.json();
};

export const getAllStartups = async () => {
  const res = await fetch(`http://localhost:8000/api/startup`
  );

  return res.json();
};


export const getFeaturedOpportunities = async () => {
  const res = await fetch(
    "http://localhost:8000/api/featured-opportunities",
    { cache: "no-store" }
  );

  return res.json();
};

export const getAllOpportunities = async () => {
  const res = await fetch("http://localhost:8000/api/opportunities", {
    cache: "no-store",
  });

  return res.json();
};