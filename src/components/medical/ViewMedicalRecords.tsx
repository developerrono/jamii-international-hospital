import { useState, useEffect } from "react";
import * as supabaseClient from "@/intergrations/supabase/client";
const supabase = (supabaseClient as any).default ?? (supabaseClient as any).supabase;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar, FileText, Activity } from "lucide-react";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string | null;
}

interface MedicalRecord {
  id: string;
  visit_date: string;
  chief_complaint: string | null;
  diagnosis: string | null;
  prescription: string | null;
  lab_tests: string | null;
  notes: string | null;
  vitals: any;
}

interface ViewMedicalRecordsProps {
  onBack: () => void;
}

const ViewMedicalRecords = ({ onBack }: ViewMedicalRecordsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", user.id)
        .order("appointment_date", { ascending: false });

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

      // Fetch medical records
      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", user.id)
        .order("visit_date", { ascending: false });

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        ← Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
        <p className="text-muted-foreground">View your appointment history and medical records</p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointments">
            <Calendar className="w-4 h-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="records">
            <FileText className="w-4 h-4 mr-2" />
            Medical Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4 mt-6">
          {loading ? (
            <Card>
              <CardContent className="p-6">Loading...</CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="p-6">No appointments found</CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                  </CardTitle>
                  <CardDescription className="capitalize">{appointment.status}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="records" className="space-y-4 mt-6">
          {loading ? (
            <Card>
              <CardContent className="p-6">Loading...</CardContent>
            </Card>
          ) : medicalRecords.length === 0 ? (
            <Card>
              <CardContent className="p-6">No medical records found</CardContent>
            </Card>
          ) : (
            medicalRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {new Date(record.visit_date).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {record.chief_complaint && (
                    <div>
                      <strong>Chief Complaint:</strong>
                      <p className="text-muted-foreground">{record.chief_complaint}</p>
                    </div>
                  )}
                  {record.diagnosis && (
                    <div>
                      <strong>Diagnosis:</strong>
                      <p className="text-muted-foreground">{record.diagnosis}</p>
                    </div>
                  )}
                  {record.prescription && (
                    <div>
                      <strong>Prescription:</strong>
                      <p className="text-muted-foreground">{record.prescription}</p>
                    </div>
                  )}
                  {record.lab_tests && (
                    <div>
                      <strong>Lab Tests:</strong>
                      <p className="text-muted-foreground">{record.lab_tests}</p>
                    </div>
                  )}
                  {record.vitals && (
                    <div>
                      <strong>Vitals:</strong>
                      <p className="text-muted-foreground">{JSON.stringify(record.vitals)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewMedicalRecords;
