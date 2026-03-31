import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Save, Sparkles, Calendar, Smile, Meh, Frown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJournalEntries, useCreateJournalEntry } from "@/hooks/useJournalEntries";

const Journal = () => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);
  const { data: entries, isLoading } = useJournalEntries();
  const createEntry = useCreateJournalEntry();

  const analyzeSentiment = (text: string): "positive" | "neutral" | "negative" => {
    const positiveWords = ["happy", "good", "great", "amazing", "wonderful", "excited", "love", "grateful", "blessed", "productive", "proud", "accomplished"];
    const negativeWords = ["sad", "bad", "terrible", "awful", "hate", "angry", "stressed", "worried", "anxious", "overwhelmed", "exhausted", "frustrated"];
    const lowerText = text.toLowerCase();
    const pos = positiveWords.filter((w) => lowerText.includes(w)).length;
    const neg = negativeWords.filter((w) => lowerText.includes(w)).length;
    if (pos > neg) return "positive";
    if (neg > pos) return "negative";
    return "neutral";
  };

  const detectEmotions = (text: string): string[] => {
    const emotionMap: Record<string, string[]> = {
      happiness: ["happy", "joy", "excited", "wonderful", "love", "grateful"],
      stress: ["stressed", "overwhelmed", "pressure", "deadline", "tense"],
      anxiety: ["anxious", "worried", "nervous", "uneasy", "scared"],
      fatigue: ["tired", "exhausted", "drained", "sleepy", "burnt out"],
      motivation: ["motivated", "inspired", "determined", "focused", "productive"],
    };
    const lower = text.toLowerCase();
    return Object.entries(emotionMap)
      .filter(([, words]) => words.some((w) => lower.includes(w)))
      .map(([emotion]) => emotion);
  };

  const handleTextChange = (text: string) => {
    setJournalEntry(text);
    if (text.length > 20) {
      setSentiment(analyzeSentiment(text));
    } else {
      setSentiment(null);
    }
  };

  const handleSaveEntry = async () => {
    if (!journalEntry.trim()) {
      toast({ title: "Please write something", description: "Your journal entry cannot be empty.", variant: "destructive" });
      return;
    }

    const detectedSentiment = analyzeSentiment(journalEntry);
    const emotions = detectEmotions(journalEntry);
    const score = detectedSentiment === "positive" ? 0.8 : detectedSentiment === "negative" ? 0.2 : 0.5;

    try {
      await createEntry.mutateAsync({
        content: journalEntry,
        sentiment: detectedSentiment,
        sentiment_score: score,
        emotions,
        ai_feedback: getFeedback(detectedSentiment, emotions),
      });
      toast({ title: "Journal entry saved! 📝", description: "Your thoughts have been recorded." });
      setJournalEntry("");
      setSentiment(null);
    } catch {
      toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
    }
  };

  const getFeedback = (sent: string, emotions: string[]): string => {
    if (sent === "positive") return "Your writing reflects positive emotions! Keep nurturing these feelings.";
    if (sent === "negative") {
      if (emotions.includes("stress")) return "It sounds like you're dealing with stress. Consider a short break or breathing exercise.";
      if (emotions.includes("anxiety")) return "Anxiety can be tough. Try grounding techniques like the 5-4-3-2-1 method.";
      return "It sounds like you're going through a tough time. Consider talking to someone you trust.";
    }
    return "Your writing shows balanced emotions. Reflection like this is valuable for self-awareness.";
  };

  const getSentimentBadge = (s: string | null) => {
    if (!s) return null;
    const config = {
      positive: { icon: Smile, color: "bg-mood-good/20 text-mood-good border-mood-good/30" },
      negative: { icon: Frown, color: "bg-mood-sad/20 text-mood-sad border-mood-sad/30" },
      neutral: { icon: Meh, color: "bg-mood-neutral/20 text-mood-neutral border-mood-neutral/30" },
    }[s] || { icon: Meh, color: "" };
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        <span className="capitalize">{s}</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h1 className="text-2xl font-display font-bold flex items-center justify-center gap-2 mb-2">
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
            {getSentimentBadge(sentiment)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How was your day? What's on your mind?..."
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
                {getFeedback(sentiment, detectEmotions(journalEntry))}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-muted-foreground">{journalEntry.length} characters</p>
            <Button
              onClick={handleSaveEntry}
              disabled={!journalEntry.trim() || createEntry.isPending}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {createEntry.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)
          ) : entries && entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                  {getSentimentBadge(entry.sentiment)}
                </div>
                <p className="text-sm text-foreground line-clamp-2">{entry.content}</p>
                {entry.emotions && entry.emotions.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {entry.emotions.map((e) => (
                      <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No journal entries yet. Start writing to track your emotional patterns!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Writing Prompts */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Writing Prompts</CardTitle>
          <p className="text-sm text-muted-foreground">Need inspiration? Try one of these</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {["What am I most grateful for today?", "What challenge did I overcome recently?", "How do I want to feel tomorrow?", "What made me smile this week?", "What would I tell my younger self?"].map((prompt, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full text-left justify-start hover:bg-primary/5 hover:border-primary transition-all"
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
