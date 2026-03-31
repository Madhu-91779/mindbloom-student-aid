import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import MoodLogger from "@/components/MoodLogger";
import Analytics from "@/components/Analytics";
import Journal from "@/components/Journal";
import Goals from "@/components/Goals";
import Navigation from "@/components/Navigation";
import SettingsPanel from "@/components/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "mood":
        return <MoodLogger />;
      case "analytics":
        return <Analytics />;
      case "journal":
        return <Journal />;
      case "goals":
        return <Goals />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
