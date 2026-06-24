export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const parseJson = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
};

export const apiGet = (path) => request(path, { method: "GET" });
export const apiPost = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = (path) =>
  request(path, { method: "DELETE" });


