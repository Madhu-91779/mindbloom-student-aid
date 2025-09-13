import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, Calendar, Zap, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);

  const weeklyGoals = [
    { 
      id: 1, 
      title: "Exercise 4 times this week", 
      progress: 75, 
      completed: 3, 
      total: 4, 
      category: "Health",
      dueDate: "End of week"
    },
    { 
      id: 2, 
      title: "Read for 30 minutes daily", 
      progress: 86, 
      completed: 6, 
      total: 7, 
      category: "Learning",
      dueDate: "Daily"
    },
    { 
      id: 3, 
      title: "Drink 8 glasses of water daily", 
      progress: 57, 
      completed: 4, 
      total: 7, 
      category: "Health",
      dueDate: "Daily"
    },
  ];

  const dailyHabits = [
    { id: 1, title: "Morning meditation (10 min)", completed: true, streak: 12 },
    { id: 2, title: "Gratitude journaling", completed: true, streak: 8 },
    { id: 3, title: "Take vitamins", completed: false, streak: 5 },
    { id: 4, title: "No social media before 10 AM", completed: true, streak: 3 },
    { id: 5, title: "Walk 10,000 steps", completed: false, streak: 15 },
  ];

  const monthlyGoals = [
    { 
      id: 1, 
      title: "Complete online course", 
      progress: 45, 
      category: "Learning",
      dueDate: "March 31"
    },
    { 
      id: 2, 
      title: "Save $200", 
      progress: 70, 
      category: "Finance",
      dueDate: "March 31"
    },
    { 
      id: 3, 
      title: "Make 3 new friends", 
      progress: 33, 
      category: "Social",
      dueDate: "March 31"
    },
  ];

  const handleAddGoal = () => {
    if (!newGoal.trim()) {
      toast({
        title: "Please enter a goal",
        description: "Goal title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Goal added! 🎯",
      description: "Your new goal has been added to your list.",
    });

    setNewGoal("");
    setShowAddGoal(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Health": "bg-secondary/20 text-secondary border-secondary/30",
      "Learning": "bg-primary/20 text-primary border-primary/30",
      "Finance": "bg-accent/20 text-accent border-accent/30",
      "Social": "bg-mood-good/20 text-mood-good border-mood-good/30",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <Target className="h-6 w-6 text-primary" />
          Goals & Habits
        </h1>
        <p className="text-muted-foreground">Track your progress and build positive habits</p>
      </div>

      {/* Add New Goal */}
      <Card className="border-0 bg-card shadow-card">
        <CardContent className="p-4">
          {!showAddGoal ? (
            <Button 
              onClick={() => setShowAddGoal(true)}
              className="w-full h-12 bg-primary hover:bg-primary-dark transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Goal
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Enter your new goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="border-input focus:border-primary"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Habits */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Daily Habits
          </CardTitle>
          <p className="text-sm text-muted-foreground">Build consistency one day at a time</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyHabits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <Checkbox 
                checked={habit.completed}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  habit.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}>
                  {habit.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-accent-light/20 text-accent border-accent/30">
                    <Trophy className="h-3 w-3 mr-1" />
                    {habit.streak} day streak
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyGoals.map((goal) => (
            <div key={goal.id} className="space-y-3 p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{goal.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {goal.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {goal.completed}/{goal.total}
                  </p>
                  <p className="text-xs text-muted-foreground">{goal.progress}%</p>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Goals */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyGoals.map((goal) => (
            <div key={goal.id} className="space-y-3 p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{goal.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {goal.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{goal.progress}%</p>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Goal Insights */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">This Week's Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-mood-good rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Great Progress!</p>
              <p className="text-xs text-muted-foreground">You're 23% ahead of your weekly targets</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Habit Building</p>
              <p className="text-xs text-muted-foreground">Your meditation streak is building strong routine</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Focus Area</p>
              <p className="text-xs text-muted-foreground">Consider setting more social connection goals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-accent-light/20 border border-accent/30 rounded-lg text-center">
              <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Goal Crusher</p>
              <p className="text-xs text-muted-foreground">Completed 5 goals this month</p>
            </div>
            
            <div className="p-3 bg-secondary-light/20 border border-secondary/30 rounded-lg text-center">
              <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Habit Master</p>
              <p className="text-xs text-muted-foreground">12-day meditation streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;