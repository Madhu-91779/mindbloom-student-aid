import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Habit {
  id: string;
  title: string;
  streak: number;
  best_streak: number;
  is_active: boolean;
  created_at: string;
  completed_today?: boolean;
}

export const useHabits = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["habits", user?.id, today],
    queryFn: async () => {
      const { data: habits, error } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const { data: completions } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .eq("completed_date", today);

      const completedIds = new Set((completions || []).map((c: any) => c.habit_id));
      return (habits as Habit[]).map((h) => ({ ...h, completed_today: completedIds.has(h.id) }));
    },
    enabled: !!user,
  });
};

export const useCreateHabit = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("habits")
        .insert({ title, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
};

export const useToggleHabit = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      if (completed) {
        // Uncomplete: delete today's completion
        await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_date", today);
        // Decrement streak
        await supabase.rpc("decrement_habit_streak" as any, { habit_id_input: habitId });
      } else {
        // Complete: insert today's completion
        const { error } = await supabase
          .from("habit_completions")
          .insert({ habit_id: habitId, user_id: user!.id, completed_date: today });
        if (error) throw error;
        // Increment streak
        await supabase
          .from("habits")
          .update({ streak: (await supabase.from("habits").select("streak").eq("id", habitId).single()).data!.streak + 1 })
          .eq("id", habitId);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
};
