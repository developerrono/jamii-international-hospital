import { ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, Home, Info, UserCircle } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  user: User | null;
  userRole: string | null;
  onLogout: () => void;
}

const DashboardLayout = ({ children, user, userRole, onLogout }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Jamii International</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
