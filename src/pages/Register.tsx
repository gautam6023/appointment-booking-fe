import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SignupSchema, type SignupRequest, type ApiError } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getCurrentTimezoneOffset } from "../utils/timeUtils";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [showSharableId, setShowSharableId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<SignupRequest, "timezone">>({
    resolver: zodResolver(SignupSchema.omit({ timezone: true })),
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading && !showSharableId) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, showSharableId, navigate]);

  const onSubmit = async (data: Omit<SignupRequest, "timezone">) => {
    try {
      // Auto-detect and add timezone
      const timezone = getCurrentTimezoneOffset();
      const signupData: SignupRequest = {
        ...data,
        timezone,
      };
      
      await signup(signupData);
      toast.success("Account created successfully!");
      setShowSharableId(true);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (showSharableId && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-sm text-gray-600">Your account has been created. Save your Sharable ID below.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Sharable ID</label>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <code className="text-sm text-blue-900 break-all">{user.sharableId}</code>
              </div>
              <p className="mt-2 text-xs text-gray-500">Share this ID with others so they can book appointments with you.</p>
            </div>

            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with your appointment scheduling</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
