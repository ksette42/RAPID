import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Token injected from auth store
  return config;
});

export const analyzeCode = async (params: {
  title: string;
  content: string;
  type: string;
  token: string;
}) => {
  const response = await api.post("/api/analyze", params, {
    headers: { Authorization: `Bearer ${params.token}` },
  });
  return response.data;
};

export const getSuggestions = async (token: string) => {
  const response = await api.get("/api/suggestions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
