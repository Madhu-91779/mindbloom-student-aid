import { useState } from "react";
import { Home, Heart, BarChart3, BookOpen, Target, Settings } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "mood", icon: Heart, label: "Mood" },
    { id: "analytics", icon: BarChart3, label: "Insights" },
    { id: "journal", icon: BookOpen, label: "Journal" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-wellness z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-primary-light/20" 
                  : "hover:bg-muted"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-primary rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;