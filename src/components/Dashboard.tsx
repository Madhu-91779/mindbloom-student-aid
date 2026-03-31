import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Moon, Activity, BookOpen, Target, TrendingUp } from "lucide-react";
import { useMoodLogs } from "@/hooks/useMoodLogs";
import { useSleepLogs } from "@/hooks/useSleepLogs";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/wellness-hero.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: moodLogs, isLoading: moodLoading } = useMoodLogs(7);
  const { data: sleepLogs, isLoading: sleepLoading } = useSleepLogs(7);
  const { data: activityLogs, isLoading: activityLoading } = useActivityLogs(7);
  const { data: goals, isLoading: goalsLoading } = useGoals("daily");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  // Compute averages from real data
  const avgSleep = sleepLogs?.length
    ? (sleepLogs.reduce((sum, l) => sum + l.hours, 0) / sleepLogs.length).toFixed(1)
    : "--";
  const totalSteps = activityLogs?.reduce((sum, l) => sum + (l.steps || 0), 0) || 0;
  const avgMood = moodLogs?.length
    ? (moodLogs.reduce((sum, l) => sum + l.intensity, 0) / moodLogs.length).toFixed(1)
    : "--";

  // Recent mood emojis
  const recentMoods = (moodLogs || []).slice(0, 4);

  // Today's goals
  const todaysGoals = (goals || []).slice(0, 4);

  const isLoading = moodLoading || sleepLoading || activityLoading || goalsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-b-3xl">
        <img src={heroImage} alt="Wellness background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <h1 className="text-3xl font-display font-bold mb-2 animate-bounce-in">
            Hey, {displayName}! ✨
          </h1>
          <p className="text-primary-foreground/90 font-medium">{currentDate}</p>
          <p className="text-sm text-primary-foreground/80 mt-1">How are you feeling today?</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Quick Mood Summary */}
        <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-wellness backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary animate-pulse-gentle" />
                Recent Moods
              </h2>
              <Badge variant="outline" className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 font-medium">
                Avg: {avgMood}/10
              </Badge>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-4 gap-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : recentMoods.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {recentMoods.map((mood) => (
                  <div key={mood.id} className="h-20 flex flex-col items-center justify-center border rounded-lg bg-card">
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs text-muted-foreground mt-1">{mood.mood}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No moods logged yet. Start by checking in! 💫
              </p>
            )}
          </CardContent>
        </Card>

        {/* Wellness Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 bg-card shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Moon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sleep</p>
                  {sleepLoading ? <Skeleton className="h-8 w-16" /> : (
                    <p className="text-2xl font-bold text-secondary">{avgSleep}h</p>
                  )}
                </div>
              </div>
              <Progress value={avgSleep !== "--" ? (Number(avgSleep) / 9) * 100 : 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {avgSleep !== "--" ? `${Math.round((Number(avgSleep) / 8) * 100)}% of 8h goal` : "No data yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Steps</p>
                  {activityLoading ? <Skeleton className="h-8 w-20" /> : (
                    <p className="text-2xl font-bold text-accent">{totalSteps.toLocaleString()}</p>
                  )}
                </div>
              </div>
              <Progress value={Math.min((totalSteps / 70000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {totalSteps > 0 ? `${Math.round((totalSteps / 70000) * 100)}% of weekly 70k` : "No data yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Goals */}
        <Card className="border-0 bg-gradient-to-br from-card to-secondary/5 shadow-wellness">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Target className="h-5 w-5 text-secondary" />
              Today's Goals 🎯
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalsLoading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-12" />)
            ) : todaysGoals.length > 0 ? (
              todaysGoals.map((goal) => {
                const progress = goal.target_count > 0 ? Math.round((goal.current_count / goal.target_count) * 100) : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${goal.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {goal.title}
                      </p>
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No goals set yet. Head to Goals to create some!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Insights */}
        <Card className="border-0 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 shadow-wellness backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h3 className="font-display font-semibold">Weekly Insights</h3>
            </div>
            <div className="space-y-3">
              {moodLogs && moodLogs.length >= 3 ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-mood-good rounded-full" />
                    <p className="text-sm text-foreground">
                      Average mood this week: {avgMood}/10 {Number(avgMood) >= 7 ? "— looking great! 🌟" : "— keep going! 💪"}
                    </p>
                  </div>
                  {sleepLogs && sleepLogs.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <p className="text-sm text-foreground">
                        Avg sleep: {avgSleep}hrs {Number(avgSleep) >= 7 ? "— solid rest! 😴" : "— try for more rest 🛌"}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Log a few more days to unlock personalized insights! 📊
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <Button className="h-16 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity font-display font-medium">
            <div className="flex flex-col items-center gap-1">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Write Journal</span>
            </div>
          </Button>
          <Button variant="outline" className="h-16 hover:bg-secondary/10 hover:border-secondary transition-all font-display font-medium">
            <div className="flex flex-col items-center gap-1">
              <Target className="h-5 w-5 text-secondary" />
              <span className="text-sm text-secondary">Set Goals</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
