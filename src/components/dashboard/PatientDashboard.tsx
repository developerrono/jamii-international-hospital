import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Calendar, FileText, CreditCard, Activity, Beaker } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookAppointment from "@/components/appointments/BookAppointment";
import PayBills from "@/components/billing/PayBills";
import ViewMedicalRecords from "@/components/medical/ViewMedicalRecords";
import { useNavigate } from "react-router-dom";

interface PatientDashboardProps {
  user: User | null;
}

const PatientDashboard = ({ user }: PatientDashboardProps) => {
  const [activeView, setActiveView] = useState<"dashboard" | "book-appointment" | "pay-bills" | "medical-records">("dashboard");
  const navigate = useNavigate();

  if (activeView === "book-appointment") {
    return (
      <div>
        <Button variant="ghost" onClick={() => setActiveView("dashboard")} className="mb-4">
          ← Back to Dashboard
        </Button>
        <BookAppointment />
      </div>
    );
  }

  if (activeView === "pay-bills") {
    return (
      <div>
        <Button variant="ghost" onClick={() => setActiveView("dashboard")} className="mb-4">
          ← Back to Dashboard
        </Button>
        <PayBills />
      </div>
    );
  }

  if (activeView === "medical-records") {
    return <ViewMedicalRecords onBack={() => setActiveView("dashboard")} />;
  }

  const quickActions = [
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Schedule a new appointment with a doctor",
      color: "text-medical-blue",
    },
    {
      icon: Activity,
      title: "View Medical Records",
      description: "Access your health records and history",
      color: "text-medical-green",
    },
    {
      icon: CreditCard,
      title: "Pay Bills",
      description: "View and pay pending invoices via M-Pesa",
      color: "text-medical-purple",
    },
    {
      icon: FileText,
      title: "My Appointments",
      description: "View upcoming and past appointments",
      color: "text-medical-teal",
    },
    {
      icon: Beaker,
      title: "Chemistry & Lab Results",
      description: "View your laboratory test results",
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Patient Portal</h1>
        <p className="text-primary-foreground/90">
          Manage your appointments, view medical records, and pay bills securely
        </p>
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
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (index === 0) setActiveView("book-appointment");
                    else if (index === 1) setActiveView("medical-records");
                    else if (index === 2) setActiveView("pay-bills");
                    else if (index === 4) navigate("/laboratory");
                  }}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>No Recent Activity</CardTitle>
            <CardDescription>
              Your appointments, medical records, and billing information will appear here
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
