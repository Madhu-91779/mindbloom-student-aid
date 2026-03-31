import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Brain, Target, Award } from "lucide-react";
import { useMoodLogs } from "@/hooks/useMoodLogs";
import { useSleepLogs } from "@/hooks/useSleepLogs";
import { useGoals } from "@/hooks/useGoals";

const Analytics = () => {
  const { data: moodLogs, isLoading: moodLoading } = useMoodLogs(7);
  const { data: sleepLogs, isLoading: sleepLoading } = useSleepLogs(7);
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const isLoading = moodLoading || sleepLoading || goalsLoading;

  // Build weekly mood data from real logs
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyMoodData = dayNames.map((day, dayIndex) => {
    const dayLogs = (moodLogs || []).filter((l) => new Date(l.logged_at).getDay() === dayIndex);
    const avg = dayLogs.length ? Math.round(dayLogs.reduce((s, l) => s + l.intensity, 0) / dayLogs.length) : 0;
    const color = avg >= 8 ? "bg-mood-happy" : avg >= 6 ? "bg-mood-good" : avg >= 4 ? "bg-mood-neutral" : avg > 0 ? "bg-mood-sad" : "bg-muted";
    return { day, mood: avg, color };
  });

  const avgMood = moodLogs?.length ? (moodLogs.reduce((s, l) => s + l.intensity, 0) / moodLogs.length).toFixed(1) : "--";
  const avgSleep = sleepLogs?.length ? (sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length).toFixed(1) : "--";
  const completedGoals = goals?.filter((g) => g.is_completed).length || 0;
  const totalGoals = goals?.length || 0;
  const goalCompletion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Generate insights from real data
  const insights = [];
  if (moodLogs && moodLogs.length >= 3) {
    const recent = moodLogs.slice(0, 3);
    const avgRecent = recent.reduce((s, l) => s + l.intensity, 0) / recent.length;
    insights.push({
      title: "Mood Trends",
      description: avgRecent >= 7 ? "Your mood has been consistently positive recently!" : avgRecent >= 5 ? "Your mood is balanced — keep tracking to spot patterns." : "Your mood has been lower lately. Consider trying relaxation techniques.",
      icon: TrendingUp,
      color: "text-mood-good",
    });
  }
  if (sleepLogs && sleepLogs.length >= 3) {
    const avg = Number(avgSleep);
    insights.push({
      title: "Sleep Impact",
      description: avg >= 7.5 ? "Great sleep habits! Quality rest supports better moods." : avg >= 6 ? "Decent sleep, but aiming for 7-8 hours could boost your mood." : "Low sleep detected. This may be affecting your mood and energy.",
      icon: Brain,
      color: "text-secondary",
    });
  }
  if (goals && totalGoals > 0) {
    insights.push({
      title: "Goal Progress",
      description: goalCompletion >= 70 ? "Crushing it! Most of your goals are on track." : goalCompletion >= 40 ? "Good progress on your goals. Keep the momentum going!" : "Some goals need attention. Try focusing on one at a time.",
      icon: Target,
      color: "text-accent",
    });
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h1 className="text-2xl font-display font-bold flex items-center justify-center gap-2 mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          📊 Your Analytics
        </h1>
        <p className="text-muted-foreground">Insights from your wellness journey</p>
      </div>

      {/* Weekly Mood Chart */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weeklyMoodData.map((day, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground font-medium">{day.day}</div>
                    <div className="relative h-20 bg-muted rounded-lg overflow-hidden">
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${day.color} transition-all duration-500 rounded-lg`}
                        style={{ height: `${day.mood > 0 ? (day.mood / 10) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-foreground">{day.mood || "-"}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Low</span><span>High</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Key Insights
          </h2>
          {insights.map((insight, index) => (
            <Card key={index} className="border-0 bg-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly Stats */}
      <Card className="border-0 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">This Week's Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Average Mood</span>
              <span className="text-sm font-bold text-primary">{avgMood}/10</span>
            </div>
            <Progress value={avgMood !== "--" ? Number(avgMood) * 10 : 0} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Sleep Quality</span>
              <span className="text-sm font-semibold">{avgSleep !== "--" ? `${avgSleep}h` : "--"}</span>
            </div>
            <Progress value={avgSleep !== "--" ? (Number(avgSleep) / 10) * 100 : 0} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Goal Completion</span>
              <span className="text-sm font-semibold">{goalCompletion}%</span>
            </div>
            <Progress value={goalCompletion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!isLoading && (!moodLogs || moodLogs.length === 0) && (
        <Card className="border-0 bg-card shadow-card">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold mb-2">Start Building Your Story</h3>
            <p className="text-sm text-muted-foreground">
              Log your moods, sleep, and activities to unlock personalized analytics and insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
