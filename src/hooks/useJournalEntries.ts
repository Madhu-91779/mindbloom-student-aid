import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface JournalEntry {
  id: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  sentiment_score: number | null;
  emotions: string[];
  ai_feedback: string | null;
  created_at: string;
}

export const useJournalEntries = (limit = 20) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["journal_entries", user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user,
  });
};

export const useCreateJournalEntry = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entry: { content: string; sentiment?: string; sentiment_score?: number; emotions?: string[]; ai_feedback?: string }) => {
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({ ...entry, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal_entries"] }),
  });
};
