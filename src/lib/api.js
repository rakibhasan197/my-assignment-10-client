export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiRequest = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};