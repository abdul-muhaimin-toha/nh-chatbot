"use server";

import api from "@/lib/axios";

export async function schedule_api(payload) {
  console.log("payload", payload);
  try {
    const { data } = await api.post("/google-calendar/schedule", payload);
    console.log("API response:", data);

    return data || {};
  } catch (error) {
    const apiError = error?.response?.data;
    return {
      answer: apiError?.message || "Failed to get response from API",
      status: apiError?.status,
    };
  }
}
