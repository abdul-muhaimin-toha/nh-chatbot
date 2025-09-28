import { schedule_api } from "@/services/schedule";
import { useMutation } from "@tanstack/react-query";

export const useScheduleApi = () => {
  // Return the full mutation object
  return useMutation({
    mutationFn: async (payload) => {
      const res = await schedule_api(payload);
      return res;
    },
    onError: (error) => {
      console.error("Schedule API error:", error);
    },
  });
};
