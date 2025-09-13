import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Save, Sparkles, Calendar, Smile, Meh, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Journal = () => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);

  // Mock sentiment analysis - in real app this would call an AI service
  const analyzeSentiment = (text: string) => {
    const positiveWords = ["happy", "good", "great", "amazing", "wonderful", "excited", "love", "grateful", "blessed"];
    const negativeWords = ["sad", "bad", "terrible", "awful", "hate", "angry", "stressed", "worried", "anxious"];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const handleTextChange = (text: string) => {
    setJournalEntry(text);
    if (text.length > 20) {
      const analyzedSentiment = analyzeSentiment(text);
      setSentiment(analyzedSentiment);
    } else {
      setSentiment(null);
    }
  };

  const handleSaveEntry = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Please write something",
        description: "Your journal entry cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to your database
    toast({
      title: "Journal entry saved! 📝",
      description: "Your thoughts have been recorded and analyzed.",
    });

    setJournalEntry("");
    setSentiment(null);
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive": return <Smile className="h-4 w-4 text-mood-good" />;
      case "negative": return <Frown className="h-4 w-4 text-mood-sad" />;
      default: return <Meh className="h-4 w-4 text-mood-neutral" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive": return "bg-mood-good/20 text-mood-good border-mood-good/30";
      case "negative": return "bg-mood-sad/20 text-mood-sad border-mood-sad/30";
      default: return "bg-mood-neutral/20 text-mood-neutral border-mood-neutral/30";
    }
  };

  const getSentimentFeedback = () => {
    switch (sentiment) {
      case "positive": 
        return "Your writing reflects positive emotions! Keep nurturing these feelings.";
      case "negative": 
        return "It sounds like you're going through a tough time. Consider talking to someone you trust.";
      default: 
        return "Your writing shows balanced emotions. This kind of reflection is valuable.";
    }
  };

  const recentEntries = [
    {
      date: "Today, 2:30 PM",
      preview: "Had a great study session today. Feeling productive and motivated...",
      sentiment: "positive"
    },
    {
      date: "Yesterday, 8:15 PM", 
      preview: "Exam stress is getting to me, but I'm trying to stay positive...",
      sentiment: "neutral"
    },
    {
      date: "2 days ago, 10:45 AM",
      preview: "Really enjoyed spending time with friends. We laughed so much...",
      sentiment: "positive"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Journal
        </h1>
        <p className="text-muted-foreground">Express your thoughts and feelings</p>
      </div>

      {/* New Entry */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              New Entry
            </span>
            {sentiment && (
              <Badge variant="outline" className={getSentimentColor()}>
                {getSentimentIcon()}
                <span className="ml-1 capitalize">{sentiment}</span>
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How was your day? What's on your mind? Share your thoughts and feelings..."
            value={journalEntry}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-32 border-input focus:border-primary transition-colors resize-none"
          />
          
          {sentiment && (
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Sentiment Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getSentimentFeedback()}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-muted-foreground">
              {journalEntry.length} characters • Your entries are private and secure
            </p>
            <Button 
              onClick={handleSaveEntry}
              disabled={!journalEntry.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-0 bg-gradient-to-br from-accent/5 to-primary/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Pattern Recognition</p>
              <p className="text-xs text-muted-foreground">Your mood tends to improve when you write about accomplishments</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Emotional Growth</p>
              <p className="text-xs text-muted-foreground">You're becoming better at expressing complex emotions in writing</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium text-foreground">Reflection Habit</p>
              <p className="text-xs text-muted-foreground">You've been consistently journaling for 12 days - great habit!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentEntries.map((entry, index) => (
            <div 
              key={index}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{entry.date}</span>
                <Badge 
                  variant="outline" 
                  className={
                    entry.sentiment === "positive" 
                      ? "bg-mood-good/20 text-mood-good border-mood-good/30"
                      : entry.sentiment === "negative"
                      ? "bg-mood-sad/20 text-mood-sad border-mood-sad/30"
                      : "bg-mood-neutral/20 text-mood-neutral border-mood-neutral/30"
                  }
                >
                  {entry.sentiment === "positive" ? (
                    <Smile className="h-3 w-3 mr-1" />
                  ) : entry.sentiment === "negative" ? (
                    <Frown className="h-3 w-3 mr-1" />
                  ) : (
                    <Meh className="h-3 w-3 mr-1" />
                  )}
                  {entry.sentiment}
                </Badge>
              </div>
              <p className="text-sm text-foreground line-clamp-2">{entry.preview}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Writing Prompts */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Writing Prompts</CardTitle>
          <p className="text-sm text-muted-foreground">Need inspiration? Try one of these prompts</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "What am I most grateful for today?",
            "What challenge did I overcome recently?",
            "How do I want to feel tomorrow?",
            "What made me smile this week?",
            "What would I tell my younger self?"
          ].map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start hover:bg-primary-light/10 hover:border-primary transition-all"
              onClick={() => setJournalEntry(prompt + " ")}
            >
              <span className="text-sm">{prompt}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;