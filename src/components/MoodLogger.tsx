import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Heart, Calendar, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MoodLogger = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState([5]);
  const [moodNote, setMoodNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const currentTime = new Date().toLocaleString();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling before saving.",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to your database
    toast({
      title: "Mood logged successfully! 🎉",
      description: "Your mood has been recorded and will help track your wellness journey.",
    });

    // Reset form
    setSelectedMood(null);
    setMoodIntensity([5]);
    setMoodNote("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-display font-bold flex items-center justify-center gap-2 mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-bounce-in">
          💫 mood diary ✨
        </h1>
        <p className="text-muted-foreground font-medium">spill the tea - how u feelin rn?</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Mood Selection */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">pick ur vibe ✨</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {moodOptions.map((mood, index) => (
              <Button
                key={index}
                variant={selectedMood === mood.label ? "default" : "outline"}
                className={`h-20 flex-col space-y-2 transition-all duration-300 font-display ${
                  selectedMood === mood.label 
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow scale-110 animate-glow-pulse" 
                    : "hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 hover:border-primary hover:scale-105 hover:shadow-wellness"
                }`}
                onClick={() => handleMoodSelect(mood.label)}
              >
                <span className="text-3xl animate-bounce-in">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Intensity */}
      {selectedMood && (
        <Card className="border-0 bg-gradient-to-br from-accent/5 via-card to-secondary/5 shadow-wellness animate-slide-up backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display">intensity check 🌡️</CardTitle>
            <p className="text-sm text-muted-foreground">
              how hard is this mood hitting? no cap 💯
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mild</span>
                <span>Intense</span>
              </div>
              <Slider
                value={moodIntensity}
                onValueChange={setMoodIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <Badge variant="outline" className="bg-primary-light/20 text-primary-dark border-primary-light">
                  {moodIntensity[0]}/10
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Tags */}
      <Card className="border-0 bg-gradient-to-br from-secondary/5 via-card to-primary/5 shadow-wellness backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">what's the sitch? 🤔</CardTitle>
          <p className="text-sm text-muted-foreground">
            tag what's influencing ur energy rn (optional but helpful! 💫)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {moodTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-secondary-light/20 hover:border-secondary"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Notes */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Want to share more about your feelings? (Optional)
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your mood in more detail..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="min-h-24 border-input focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-2">
            This will be analyzed for sentiment to provide you with better insights.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="pb-6">
        <Button 
          onClick={handleSaveMood}
          disabled={!selectedMood}
          className="w-full h-14 text-lg font-display font-semibold bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary-dark hover:via-accent/80 hover:to-secondary/80 disabled:opacity-50 disabled:hover:from-primary disabled:hover:via-accent disabled:hover:to-secondary transition-all duration-300 hover:scale-105 hover:shadow-glow animate-glow-pulse"
        >
          <Save className="h-5 w-5 mr-2" />
          save this vibe ✨
        </Button>
      </div>
    </div>
  );
};

export default MoodLogger;