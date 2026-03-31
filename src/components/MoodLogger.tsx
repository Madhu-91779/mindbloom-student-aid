import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateMoodLog, useMoodLogs } from "@/hooks/useMoodLogs";

const moodOptions = [
  { emoji: "😄", label: "Excited", color: "mood-happy" },
  { emoji: "😊", label: "Happy", color: "mood-happy" },
  { emoji: "😌", label: "Content", color: "mood-good" },
  { emoji: "😐", label: "Neutral", color: "mood-neutral" },
  { emoji: "😟", label: "Worried", color: "mood-anxious" },
  { emoji: "😔", label: "Sad", color: "mood-sad" },
  { emoji: "😰", label: "Anxious", color: "mood-anxious" },
  { emoji: "😤", label: "Frustrated", color: "mood-anxious" },
  { emoji: "😴", label: "Tired", color: "mood-neutral" },
];

const moodTags = [
  "School", "Friends", "Family", "Health", "Sleep", "Exercise",
  "Work", "Stress", "Relaxed", "Motivated", "Overwhelmed", "Grateful"
];

const MoodLogger = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [moodIntensity, setMoodIntensity] = useState([5]);
  const [moodNote, setMoodNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const createMood = useCreateMoodLog();
  const { data: recentMoods } = useMoodLogs(7);

  const handleMoodSelect = (mood: string, emoji: string) => {
    setSelectedMood(mood);
    setSelectedEmoji(emoji);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      toast({ title: "Please select a mood", description: "Choose how you're feeling before saving.", variant: "destructive" });
      return;
    }

    try {
      await createMood.mutateAsync({
        mood: selectedMood,
        emoji: selectedEmoji,
        intensity: moodIntensity[0],
        tags: selectedTags,
        note: moodNote || null,
      });
      toast({ title: "Mood logged! ✨", description: "Your mood has been recorded." });
      setSelectedMood(null);
      setSelectedEmoji("");
      setMoodIntensity([5]);
      setMoodNote("");
      setSelectedTags([]);
    } catch {
      toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h1 className="text-2xl font-display font-bold flex items-center justify-center gap-2 mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          💫 Mood Check-in
        </h1>
        <p className="text-muted-foreground">How are you feeling right now?</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Mood Selection */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">Pick your vibe ✨</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {moodOptions.map((mood, index) => (
              <Button
                key={index}
                variant={selectedMood === mood.label ? "default" : "outline"}
                className={`h-20 flex-col space-y-2 transition-all duration-300 font-display ${
                  selectedMood === mood.label
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow scale-110"
                    : "hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 hover:border-primary hover:scale-105"
                }`}
                onClick={() => handleMoodSelect(mood.label, mood.emoji)}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intensity */}
      {selectedMood && (
        <Card className="border-0 bg-gradient-to-br from-accent/5 via-card to-secondary/5 shadow-wellness animate-slide-up backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display">Intensity 🌡️</CardTitle>
            <p className="text-sm text-muted-foreground">How strong is this feeling?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Mild</span><span>Intense</span>
            </div>
            <Slider value={moodIntensity} onValueChange={setMoodIntensity} max={10} min={1} step={1} />
            <div className="text-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{moodIntensity[0]}/10</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      <Card className="border-0 bg-gradient-to-br from-secondary/5 via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">What's influencing you? 🤔</CardTitle>
          <p className="text-sm text-muted-foreground">Tag what's affecting your energy (optional)</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {moodTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag) ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/10 hover:border-secondary"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Additional Notes</CardTitle>
          <p className="text-sm text-muted-foreground">Want to share more? (Optional)</p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe what's on your mind..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="min-h-24 border-input focus:border-primary transition-colors"
          />
        </CardContent>
      </Card>

      {/* Recent Moods */}
      {recentMoods && recentMoods.length > 0 && (
        <Card className="border-0 bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Recent Moods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentMoods.slice(0, 7).map((log) => (
                <div key={log.id} className="flex-shrink-0 text-center p-3 bg-muted rounded-lg min-w-[70px]">
                  <span className="text-2xl">{log.emoji}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.logged_at).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save */}
      <div className="pb-6">
        <Button
          onClick={handleSaveMood}
          disabled={!selectedMood || createMood.isPending}
          className="w-full h-14 text-lg font-display font-semibold bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 disabled:opacity-50 transition-all duration-300"
        >
          {createMood.isPending ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
          Save Mood ✨
        </Button>
      </div>
    </div>
  );
};

export default MoodLogger;
