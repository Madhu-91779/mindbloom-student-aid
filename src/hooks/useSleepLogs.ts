import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SleepLog {
  id: string;
  hours: number;
  quality: number | null;
  bedtime: string | null;
  wake_time: string | null;
  notes: string | null;
  logged_date: string;
}

export const useSleepLogs = (days = 30) => {
  const { user } = useAuth();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return useQuery({
    queryKey: ["sleep_logs", user?.id, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .gte("logged_date", since.toISOString().split("T")[0])
        .order("logged_date", { ascending: false });
      if (error) throw error;
      return data as SleepLog[];
    },
    enabled: !!user,
  });
};

export const useCreateSleepLog = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (log: Omit<SleepLog, "id">) => {
      const { data, error } = await supabase
        .from("sleep_logs")
        .insert({ ...log, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sleep_logs"] }),
  });
};
