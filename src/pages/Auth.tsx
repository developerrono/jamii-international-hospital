import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as supabaseClient from "@/intergrations/supabase/client";
const supabase = (supabaseClient as any).default ?? (supabaseClient as any).supabase;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Activity } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password,
        });

        if (signInError) throw signInError;

        // --- NEW RBAC CHECK ---
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch profile and role after successful sign-in
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role') // Ensure your Supabase table is named 'profiles' and has a 'role' column
            .eq('id', user?.id)
            .single();

        if (profileError || !profile || !profile.role || profile.role === 'pending') {
            // 2. If unauthorized, sign the user out immediately and throw an error
            await supabase.auth.signOut(); 
            throw new Error("Access denied. Your account is unauthorized or is pending admin approval.");
        }
        // --- END RBAC CHECK ---

        toast.success(`Welcome back, ${profile.role}!`);
        navigate("/dashboard");
    } catch (error: any) {
        toast.error(error.message || "Failed to log in");
    } finally {
        setLoading(false);
    }
};

 const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    if (signupData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
    }

    setLoading(true);

    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: signupData.email,
            password: signupData.password,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
                data: {
                    full_name: signupData.fullName,
                },
            },
        });

        if (signUpError) throw signUpError;

        // --- NEW PROFILE CREATION ---
        const newUserId = signUpData.user?.id;

        if (newUserId) {
            const { error: profileError } = await supabase
                .from('profiles') // Ensure your table is named 'profiles'
                .insert([
                    { 
                        id: newUserId, 
                        full_name: signupData.fullName,
                        role: 'pending', // Set a default role that requires admin activation
                        email: signupData.email 
                    } 
                ]);

            if (profileError) {
                console.error("Failed to create profile record:", profileError);
                // The account still exists but profile data is missing - log for admin to fix
            }
        }
        // --- END PROFILE CREATION ---

        toast.success("Account created successfully! Please check your email to confirm.");
        setSignupData({ fullName: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
        toast.error(error.message || "Failed to sign up");
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">CloudHMS</h1>
          <p className="text-primary-foreground/80">Hospital Management System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up to get started with CloudHMS</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
