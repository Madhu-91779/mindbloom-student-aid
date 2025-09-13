import { useState } from "react";
import { Home, Heart, BarChart3, BookOpen, Target, Settings } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", icon: Home, label: "vibes" },
    { id: "mood", icon: Heart, label: "feels" },
    { id: "analytics", icon: BarChart3, label: "stats" },
    { id: "journal", icon: BookOpen, label: "diary" },
    { id: "goals", icon: Target, label: "goals" },
    { id: "settings", icon: Settings, label: "setup" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-lg border-t border-border/50 shadow-wellness z-50">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 font-display ${
                isActive 
                  ? "text-primary scale-110 animate-glow-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 shadow-glow" 
                  : "hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-6 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-bounce-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;