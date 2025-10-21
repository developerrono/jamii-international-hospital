import { Link } from "react-router-dom";
import { Activity, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Jamii International Hospital
            </h1>
            <p className="text-xl text-muted-foreground">
              Modern healthcare management at your fingertips
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Appointment Booking",
                description: "Schedule appointments with ease",
              },
              {
                icon: Activity,
                title: "Medical Records",
                description: "Access your health history securely",
              },
              {
                icon: CreditCard,
                title: "Seamless Billing",
                description: "Multiple payment options available",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-3" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Jamii International Hospital. All rights reserved.</p>
          <p className="mt-2">Created by <span className="font-semibold text-foreground">Developer Rono</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
