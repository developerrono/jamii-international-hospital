import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Smartphone,
    description: "Pay with M-Pesa mobile money",
    color: "text-green-600"
  },
  {
    id: "visa",
    name: "Visa",
    icon: CreditCard,
    description: "Pay with Visa card",
    color: "text-blue-600"
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: CreditCard,
    description: "Pay with Stripe",
    color: "text-purple-600"
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: Building2,
    description: "Pay with PayPal",
    color: "text-blue-500"
  }
];

const PayBills = () => {
  const handlePayment = (method: string) => {
    toast.info(`Redirecting to ${method} payment...`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Pay Your Bills</CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                onClick={() => handlePayment(method.name)}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${method.color}`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Pending Bills</h4>
            <p className="text-sm text-muted-foreground">No pending bills at the moment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayBills;
