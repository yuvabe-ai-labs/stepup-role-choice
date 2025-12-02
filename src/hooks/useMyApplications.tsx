import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "@/services/myApplication.service";

export const useMyApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["myApplications", userId],
    queryFn: () => {
      if (!userId) return Promise.resolve({ data: [], error: "No user" });
      return getMyApplications(userId);
    },
    enabled: !!userId, // run only when user is available
  });
};
