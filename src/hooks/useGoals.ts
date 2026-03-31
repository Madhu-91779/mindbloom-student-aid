import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Goal {
  id: string;
  title: string;
  category: string;
  goal_type: "daily" | "weekly" | "monthly";
  target_count: number;
  current_count: number;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
}

export const useGoals = (type?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals", user?.id, type],
    queryFn: async () => {
      let query = supabase.from("goals").select("*").order("created_at", { ascending: false });
      if (type) query = query.eq("goal_type", type);
      const { data, error } = await query;
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });
};

export const useCreateGoal = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: Pick<Goal, "title" | "category" | "goal_type" | "target_count" | "due_date">) => {
      const { data, error } = await supabase
        .from("goals")
        .insert({ ...goal, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
};
