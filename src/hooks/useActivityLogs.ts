import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ActivityLog {
  id: string;
  activity_type: string;
  duration_minutes: number | null;
  steps: number | null;
  calories: number | null;
  notes: string | null;
  logged_date: string;
}

export const useActivityLogs = (days = 30) => {
  const { user } = useAuth();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return useQuery({
    queryKey: ["activity_logs", user?.id, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .gte("logged_date", since.toISOString().split("T")[0])
        .order("logged_date", { ascending: false });
      if (error) throw error;
      return data as ActivityLog[];
    },
    enabled: !!user,
  });
};

export const useCreateActivityLog = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (log: Omit<ActivityLog, "id">) => {
      const { data, error } = await supabase
        .from("activity_logs")
        .insert({ ...log, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activity_logs"] }),
  });
};
