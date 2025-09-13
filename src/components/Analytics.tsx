import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Brain, Target, Award } from "lucide-react";

const Analytics = () => {
  const weeklyMoodData = [
    { day: "Mon", mood: 7, color: "bg-mood-good" },
    { day: "Tue", mood: 8, color: "bg-mood-happy" },
    { day: "Wed", mood: 6, color: "bg-mood-neutral" },
    { day: "Thu", mood: 9, color: "bg-mood-happy" },
    { day: "Fri", mood: 5, color: "bg-mood-neutral" },
    { day: "Sat", mood: 8, color: "bg-mood-good" },
    { day: "Sun", mood: 7, color: "bg-mood-good" },
  ];

  const insights = [
    {
      title: "Mood Trends",
      description: "Your mood has improved by 15% this week compared to last week",
      trend: "positive",
      icon: TrendingUp,
      color: "text-mood-good"
    },
    {
      title: "Sleep Impact",
      description: "Better sleep correlates with 23% higher mood ratings",
      trend: "positive", 
      icon: Brain,
      color: "text-secondary"
    },
    {
      title: "Activity Boost",
      description: "Exercise days show 18% better overall wellness scores",
      trend: "positive",
      icon: Target,
      color: "text-accent"
    }
  ];

  const achievements = [
    { title: "7-Day Streak", description: "Logged mood daily", earned: true },
    { title: "Early Bird", description: "Consistently good sleep", earned: true },
    { title: "Mindful Week", description: "Regular meditation", earned: false },
    { title: "Social Butterfly", description: "Active social connections", earned: true },
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-display font-bold flex items-center justify-center gap-2 mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-bounce-in">
          📊 ur stats are fire ✨
        </h1>
        <p className="text-muted-foreground font-medium">peep these wellness insights bestie 💫</p>
      </div>

      {/* Weekly Mood Chart */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Calendar className="h-5 w-5 text-primary animate-pulse-gentle" />
            weekly mood check 📈
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyMoodData.map((day, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    {day.day}
                  </div>
                  <div className="relative h-20 bg-muted rounded-lg overflow-hidden">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 ${day.color} transition-all duration-500 rounded-lg`}
                      style={{ height: `${(day.mood / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {day.mood}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>Poor</span>
              <span>Great</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent animate-pulse-gentle" />
          the tea ☕ (insights)
        </h2>
        
        {insights.map((insight, index) => (
          <Card key={index} className="border-0 bg-card shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-light/20 rounded-full">
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-mood-good/20 text-mood-good border-mood-good/30"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{insight.trend === 'positive' ? '15%' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Stats */}
      <Card className="border-0 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">this week's stats 📊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground font-display">average mood</span>
              <span className="text-sm font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">7.2/10 ✨</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Sleep Quality</span>
              <span className="text-sm font-semibold">8.1/10</span>
            </div>
            <Progress value={81} className="h-2" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Goal Completion</span>
              <span className="text-sm font-semibold">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  achievement.earned 
                    ? "bg-accent-light/20 border-accent/30" 
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    achievement.earned ? "bg-accent" : "bg-muted-foreground"
                  }`} />
                  <h4 className={`text-sm font-medium ${
                    achievement.earned ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {achievement.title}
                  </h4>
                </div>
                <p className={`text-xs ${
                  achievement.earned ? "text-muted-foreground" : "text-muted-foreground/60"
                }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary-light/10 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Try morning meditation</p>
              <p className="text-xs text-muted-foreground">Your mood tends to be higher on days you start with mindfulness</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-secondary-light/10 rounded-lg">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Maintain your sleep schedule</p>
              <p className="text-xs text-muted-foreground">You're doing great! Keep up the consistent 7-8 hours</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-accent-light/10 rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Plan social activity</p>
              <p className="text-xs text-muted-foreground">Your mood peaks when you connect with friends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;