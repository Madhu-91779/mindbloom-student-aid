import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface MoodLog {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  tags: string[];
  note: string | null;
  logged_at: string;
}

export const useMoodLogs = (days = 30) => {
  const { user } = useAuth();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return useQuery({
    queryKey: ["mood_logs", user?.id, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .gte("logged_at", since.toISOString())
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data as MoodLog[];
    },
    enabled: !!user,
  });
};

export const useCreateMoodLog = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (log: Omit<MoodLog, "id" | "logged_at">) => {
      const { data, error } = await supabase
        .from("mood_logs")
        .insert({ ...log, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mood_logs"] }),
  });
};
