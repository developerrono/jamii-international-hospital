import { useState, useEffect } from "react";
import * as supabaseClient from "@/intergrations/supabase/client";
const supabase = (supabaseClient as any).default ?? (supabaseClient as any).supabase;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Beaker, FileText, Download } from "lucide-react";

interface LabTest {
  id: string;
  visit_date: string;
  lab_tests: string;
  notes: string | null;
}

const Laboratory = () => {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchLabTests();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchLabTests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medical_records")
        .select("id, visit_date, lab_tests, notes")
        .eq("patient_id", user.id)
        .not("lab_tests", "is", null)
        .order("visit_date", { ascending: false });

      if (error) throw error;
      setLabTests(data || []);
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Beaker className="w-6 h-6 text-primary" />
              Chemistry & Laboratory Results
            </h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Laboratory Tests</CardTitle>
              <CardDescription>
                View all your chemistry and laboratory test results
              </CardDescription>
            </CardHeader>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="p-6">Loading laboratory results...</CardContent>
            </Card>
          ) : labTests.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No laboratory results found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your lab test results will appear here once available
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {labTests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {new Date(test.visit_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardTitle>
                        <CardDescription>Laboratory Test Results</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>Tests Performed:</strong>
                      <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{test.lab_tests}</p>
                    </div>
                    {test.notes && (
                      <div>
                        <strong>Additional Notes:</strong>
                        <p className="text-muted-foreground mt-1">{test.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Laboratory;
