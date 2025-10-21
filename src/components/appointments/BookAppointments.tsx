import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const departments = [
  "Children's Department",
  "Maternity",
  "Dental",
  "Optical",
  "Therapy",
  "X-Rays",
  "Counselling",
  "Laboratory",
  "Surgery"
];

const BookAppointment = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!selectedDepartment || !date || !reason) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Appointment request submitted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>Select a department and schedule your visit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Reason for Visit</Label>
            <Textarea
              placeholder="Briefly describe your reason for the appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Appointment Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;
