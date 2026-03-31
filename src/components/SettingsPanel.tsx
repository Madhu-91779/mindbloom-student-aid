import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Settings, LogOut, Shield, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPanel = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "See you next time!" });
  };

  const handleExportData = () => {
    toast({ title: "Export started", description: "Your data export will be ready shortly." });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center py-6">
        <h1 className="text-2xl font-display font-bold flex items-center justify-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Member since</p>
              <p className="text-sm text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "--"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card className="border-0 bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Shield className="h-5 w-5 text-secondary" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export My Data
          </Button>
          <p className="text-xs text-muted-foreground">
            Your data is encrypted and stored securely. Only you can access your entries.
          </p>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="border-0 bg-card shadow-card">
        <CardContent className="p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
