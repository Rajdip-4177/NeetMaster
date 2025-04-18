const baseUrl = import.meta.env.VITE_API_URL;

export const fetchFromApi = async (endpoint, options = {}) => {
  const res = await fetch(`${baseUrl}${endpoint}`, options);
  if (!res.ok) throw new Error('API Error');
  return res.json();
};
