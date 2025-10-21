import { User } from "@supabase/supabase-js";
import { Calendar, Users, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StaffDashboardProps {
  user: User | null;
}

const StaffDashboard = ({ user }: StaffDashboardProps) => {
  const quickActions = [
    {
      icon: Calendar,
      title: "Manage Appointments",
      description: "Schedule and manage patient appointments",
      color: "text-medical-blue",
    },
    {
      icon: Users,
      title: "Patient Registration",
      description: "Register new patients",
      color: "text-medical-green",
    },
    {
      icon: FileText,
      title: "Create Invoice",
      description: "Generate patient invoices",
      color: "text-medical-purple",
    },
    {
      icon: Activity,
      title: "View Records",
      description: "Access patient medical records",
      color: "text-medical-teal",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-primary-foreground/90">
          Manage daily operations and patient care
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Currently checked in</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <action.icon className={`w-10 h-10 ${action.color} mb-2`} />
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Access</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
