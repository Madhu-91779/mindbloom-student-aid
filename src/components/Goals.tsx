import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Calendar, Zap, Trophy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGoals, useCreateGoal, useUpdateGoal } from "@/hooks/useGoals";
import { useHabits, useCreateHabit, useToggleHabit } from "@/hooks/useHabits";

const Goals = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [goalType, setGoalType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [goalCategory, setGoalCategory] = useState("Health");
  const [targetCount, setTargetCount] = useState("7");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);

  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const createHabit = useCreateHabit();
  const toggleHabit = useToggleHabit();

  const handleAddGoal = async () => {
    if (!newGoal.trim()) {
      toast({ title: "Please enter a goal", variant: "destructive" });
      return;
    }
    try {
      await createGoal.mutateAsync({
        title: newGoal,
        category: goalCategory,
        goal_type: goalType,
        target_count: parseInt(targetCount) || 1,
        due_date: null,
      });
      toast({ title: "Goal added! 🎯" });
      setNewGoal("");
      setShowAddGoal(false);
    } catch {
      toast({ title: "Failed to add goal", variant: "destructive" });
    }
  };

  const handleAddHabit = async () => {
    if (!newHabit.trim()) {
      toast({ title: "Please enter a habit", variant: "destructive" });
      return;
    }
    try {
      await createHabit.mutateAsync(newHabit);
      toast({ title: "Habit created! ⚡" });
      setNewHabit("");
      setShowAddHabit(false);
    } catch {
      toast({ title: "Failed to add habit", variant: "destructive" });
    }
  };

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    try {
      await toggleHabit.mutateAsync({ habitId, completed });
    } catch {
      toast({ title: "Failed to update habit", variant: "destructive" });
    }
  };

  const handleIncrementGoal = async (goal: any) => {
    if (goal.current_count >= goal.target_count) return;
    const newCount = goal.current_count + 1;
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        current_count: newCount,
        is_completed: newCount >= goal.target_count,
      });
    } catch {
      toast({ title: "Failed to update goal", variant: "destructive" });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Health: "bg-secondary/20 text-secondary border-secondary/30",
      Learning: "bg-primary/20 text-primary border-primary/30",
      Finance: "bg-accent/20 text-accent border-accent/30",
      Social: "bg-mood-good/20 text-mood-good border-mood-good/30",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const weeklyGoals = (goals || []).filter((g) => g.goal_type === "weekly");
  const monthlyGoals = (goals || []).filter((g) => g.goal_type === "monthly");
  const dailyGoals = (goals || []).filter((g) => g.goal_type === "daily");

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h1 className="text-2xl font-display font-bold flex items-center justify-center gap-2 mb-2">
          <Target className="h-6 w-6 text-primary" />
          Goals & Habits
        </h1>
        <p className="text-muted-foreground">Track your progress and build positive habits</p>
      </div>

      {/* Add New Goal */}
      <Card className="border-0 bg-card shadow-card">
        <CardContent className="p-4">
          {!showAddGoal ? (
            <Button onClick={() => setShowAddGoal(true)} className="w-full h-12 bg-primary hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Add New Goal
            </Button>
          ) : (
            <div className="space-y-3">
              <Input placeholder="Enter your goal..." value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Select value={goalType} onValueChange={(v: any) => setGoalType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={goalCategory} onValueChange={setGoalCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Target" value={targetCount} onChange={(e) => setTargetCount(e.target.value)} min="1" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="flex-1" disabled={createGoal.isPending}>
                  {createGoal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Habits */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Daily Habits
            </CardTitle>
            {!showAddHabit && (
              <Button variant="ghost" size="sm" onClick={() => setShowAddHabit(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddHabit && (
            <div className="flex gap-2">
              <Input placeholder="New habit..." value={newHabit} onChange={(e) => setNewHabit(e.target.value)} />
              <Button onClick={handleAddHabit} disabled={createHabit.isPending} size="sm">Add</Button>
              <Button variant="outline" onClick={() => setShowAddHabit(false)} size="sm">✕</Button>
            </div>
          )}
          {habitsLoading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-16" />)
          ) : habits && habits.length > 0 ? (
            habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                <Checkbox
                  checked={habit.completed_today}
                  onCheckedChange={() => handleToggleHabit(habit.id, !!habit.completed_today)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${habit.completed_today ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {habit.title}
                  </p>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 mt-1">
                    <Trophy className="h-3 w-3 mr-1" />
                    {habit.streak} day streak
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No habits yet. Add one to start building consistency!</p>
          )}
        </CardContent>
      </Card>

      {/* Goals by Type */}
      {[{ title: "Weekly Goals", icon: Calendar, data: weeklyGoals }, { title: "Monthly Goals", icon: Target, data: monthlyGoals }].map(({ title, icon: Icon, data }) => (
        <Card key={title} className="border-0 bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalsLoading ? (
              [1,2].map(i => <Skeleton key={i} className="h-20" />)
            ) : data.length > 0 ? (
              data.map((goal) => {
                const progress = goal.target_count > 0 ? Math.round((goal.current_count / goal.target_count) * 100) : 0;
                return (
                  <div key={goal.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{goal.title}</h3>
                        <Badge variant="outline" className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{goal.current_count}/{goal.target_count}</p>
                        <Button variant="ghost" size="sm" onClick={() => handleIncrementGoal(goal)} disabled={goal.is_completed} className="text-xs mt-1">
                          {goal.is_completed ? "Done ✓" : "+1"}
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No {title.toLowerCase()} yet.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Goals;
