import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">CloudHMS</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6">About CloudHMS</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Pioneering cloud-native health technology for modern healthcare facilities
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-lg border border-border p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                CloudHMS is proudly developed by <strong className="text-foreground">Tinylabs Solutions</strong>. 
                We are dedicated to pioneering cloud-native health technology that simplifies hospital 
                administration and enhances patient care.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                By leveraging <strong className="text-foreground">React with TypeScript</strong> for a robust 
                user experience and a powerful backend infrastructure, we deliver a reliable and secure platform 
                that healthcare professionals can trust.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our key innovation, the seamless <strong className="text-foreground">M-Pesa integration</strong>, 
                is designed to modernize payment processes, making healthcare access faster and more convenient 
                for the patient community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• React with TypeScript</li>
                  <li>• Modern RESTful API</li>
                  <li>• Secure Authentication</li>
                  <li>• Real-time Updates</li>
                  <li>• M-Pesa Payment Integration</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Role-Based Access Control</li>
                  <li>• Patient Management</li>
                  <li>• Appointment Scheduling</li>
                  <li>• Electronic Health Records</li>
                  <li>• Billing & Invoicing</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg border border-primary/20 p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join healthcare facilities using CloudHMS to deliver better patient care
              </p>
              <Link to="/auth">
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CloudHMS by Tinylabs Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
