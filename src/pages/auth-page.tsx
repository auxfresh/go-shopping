import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
  });

  const onLogin = async (data: LoginData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setLocation("/");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const onRegister = async (data: RegisterData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      setLocation("/");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800">EliteMarket</h1>
              <p className="text-slate-600 mt-2">
                {isLoginMode ? "Welcome back! Sign in to your account" : "Create your account to get started"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {isLoginMode ? "Sign In" : "Create Account"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoginMode ? (
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...loginForm.register("email")}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Enter your password"
                        className="mt-1"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...registerForm.register("firstName")}
                          placeholder="First name"
                          className="mt-1"
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {registerForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...registerForm.register("lastName")}
                          placeholder="Last name"
                          className="mt-1"
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {registerForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerForm.register("email")}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...registerForm.register("password")}
                        placeholder="Create a password"
                        className="mt-1"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerForm.register("confirmPassword")}
                        placeholder="Confirm your password"
                        className="mt-1"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="role">Account Type</Label>
                      <Select 
                        defaultValue="customer"
                        onValueChange={(value) => registerForm.setValue("role", value as "customer" | "vendor" | "admin")}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                        </SelectContent>
                      </Select>
                      {registerForm.formState.errors.role && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.role.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <span className="text-slate-600">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <Button
                    variant="link"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="ml-1 p-0"
                  >
                    {isLoginMode ? "Sign up" : "Sign in"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:block bg-gradient-to-br from-primary to-blue-700 text-white">
          <div className="flex items-center justify-center h-full p-12">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold">Join EliteMarket</h2>
              <p className="text-xl text-blue-100">
                Discover premium products from trusted vendors worldwide
              </p>
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <h3 className="font-semibold">Shop Premium Products</h3>
                  <p className="text-blue-100 text-sm">Quality items from top vendors</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <h3 className="font-semibold">Fast Shipping</h3>
                  <p className="text-blue-100 text-sm">Quick and reliable delivery</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-blue-100 text-sm">Safe and encrypted transactions</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-semibold">Top Rated</h3>
                  <p className="text-blue-100 text-sm">Highly rated by customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
