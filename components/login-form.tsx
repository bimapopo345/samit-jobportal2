"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/logo.png" 
            alt="SAMIT Logo" 
            className="w-16 h-16 object-contain"
          />
          <div>
            <div className="font-bold text-2xl text-white">SAMIT</div>
            <div className="text-sm text-white/80">Sakura Mitra Indonesia</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">おかえりなさい</h1>
        <p className="text-white/80 text-sm">Welcome back! Sign in to your account</p>
      </div>

      <Card className="backdrop-blur-md bg-white/95 border-0 shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#ff6154] hover:text-[#ff4438] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#ff7a45] to-[#ff5555] hover:from-[#ff5555] hover:to-[#ff7a45] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-[#2B3E7C] hover:text-[#1e2a5a] font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Japanese Elements */}
      <div className="text-center text-white/60 text-xs">
        <p>頑張って！• がんばって！• Ganbatte!</p>
      </div>
    </div>
  );
}
