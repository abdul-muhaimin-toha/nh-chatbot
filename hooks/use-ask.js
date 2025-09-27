import { useMutation } from "@tanstack/react-query";
import { ask_api } from "@/services/ask";

export const useAskApi = () => {
  // Return the full mutation object
  return useMutation({
    mutationFn: async (payload) => {
      const res = await ask_api(payload);
      return res;
    },
    onError: (error) => {
      console.error("Ask API error:", error);
    },
  });
};
