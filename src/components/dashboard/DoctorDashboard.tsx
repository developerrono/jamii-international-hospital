import { User } from "@supabase/supabase-js";
import { Calendar, Users, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DoctorDashboardProps {
  user: User | null;
}

const DoctorDashboard = ({ user }: DoctorDashboardProps) => {
  const quickActions = [
    {
      icon: Calendar,
      title: "Today's Appointments",
      description: "View and manage today's schedule",
      color: "text-medical-blue",
    },
    {
      icon: Users,
      title: "My Patients",
      description: "Access patient records and history",
      color: "text-medical-green",
    },
    {
      icon: FileText,
      title: "Add Medical Record",
      description: "Create new patient medical records",
      color: "text-medical-purple",
    },
    {
      icon: Activity,
      title: "Schedule",
      description: "Manage your availability and schedule",
      color: "text-medical-teal",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-primary-foreground/90">
          Manage your appointments, patients, and medical records
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
            <p className="text-xs text-muted-foreground">No appointments scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Records created</p>
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

export default DoctorDashboard;
