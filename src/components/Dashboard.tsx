import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Moon, Activity, BookOpen, Target, TrendingUp } from "lucide-react";
import heroImage from "@/assets/wellness-hero.jpg";

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const moodData = [
    { emoji: "😄", label: "Great", count: 5, color: "mood-happy" },
    { emoji: "😊", label: "Good", count: 8, color: "mood-good" },
    { emoji: "😐", label: "Neutral", count: 3, color: "mood-neutral" },
    { emoji: "😔", label: "Low", count: 2, color: "mood-sad" },
  ];

  const todaysGoals = [
    { id: 1, title: "Drink 8 glasses of water", progress: 75, completed: false },
    { id: 2, title: "Get 8 hours of sleep", progress: 100, completed: true },
    { id: 3, title: "Exercise for 30 minutes", progress: 60, completed: false },
    { id: 4, title: "Meditate for 10 minutes", progress: 100, completed: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-b-3xl">
        <img 
          src={heroImage} 
          alt="Wellness background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Good morning! 🌅</h1>
          <p className="text-primary-foreground/90">{currentDate}</p>
          <p className="text-sm text-primary-foreground/80 mt-1">
            How are you feeling today?
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Mood Check */}
        <Card className="border-0 bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Quick Mood Check
              </h2>
              <Badge variant="outline" className="bg-primary-light/20 text-primary-dark border-primary-light">
                Daily
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {moodData.map((mood, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary-light/10 hover:border-primary transition-all duration-300"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-muted-foreground">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 bg-card shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-secondary-light/20 rounded-full">
                  <Moon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sleep</p>
                  <p className="text-2xl font-bold text-secondary">7.5h</p>
                </div>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">85% of goal</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent-light/20 rounded-full">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Activity</p>
                  <p className="text-2xl font-bold text-accent">6,420</p>
                </div>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">64% of 10k steps</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Goals */}
        <Card className="border-0 bg-card shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Today's Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Insights */}
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Weekly Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-mood-good rounded-full"></div>
                <p className="text-sm text-foreground">Your mood has been trending upward this week! 📈</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm text-foreground">You're averaging 7.2 hours of sleep - great job! 😴</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="text-sm text-foreground">Try to increase your daily activity by 500 steps 🚶‍♀️</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <Button className="h-16 bg-primary hover:bg-primary-dark transition-colors">
            <div className="flex flex-col items-center gap-1">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Journal</span>
            </div>
          </Button>
          <Button variant="outline" className="h-16 hover:bg-secondary-light/10 hover:border-secondary transition-all">
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