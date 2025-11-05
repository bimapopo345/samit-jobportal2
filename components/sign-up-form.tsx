"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "lembaga">("user");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          }
        },
      });
      
      if (signUpError) throw signUpError;
      
      // Create profile - dengan error handling yang lebih baik
      if (authData.user) {
        console.log('Creating profile for user:', authData.user.id);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: fullName,
            phone: phone,
            role: role,
          }, {
            onConflict: 'id'
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          
          // Handle common errors
          if (profileError.code === '23505' || profileError.message.includes('duplicate')) {
            console.log('Profile already exists, updating instead...');
            // Try to update existing profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                full_name: fullName,
                phone: phone,
                role: role,
              })
              .eq('id', authData.user.id);
            
            if (updateError) {
              console.error('Update error:', updateError);
            } else {
              console.log('Profile updated successfully');
            }
          } else if (profileError.code === '42501' || profileError.message.includes('permission')) {
            console.log('RLS blocking profile creation, continuing anyway...');
          } else {
            console.error('Unknown profile error:', profileError);
            // Don't throw error, just continue
          }
        } else {
          console.log('Profile created successfully');
        }
      }
      
      router.push("/auth/sign-up-success");
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
        <h1 className="text-3xl font-bold text-white mb-2">はじめまして</h1>
        <p className="text-white/80 text-sm">Nice to meet you! Create your account to get started</p>
      </div>

      <Card className="backdrop-blur-md bg-white/95 border-0 shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* Role Selection */}
              <div className="grid gap-4">
                <Label className="text-slate-700 font-medium">I want to</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "user" | "lembaga")}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="user" id="user" className="border-[#ff6154] text-[#ff6154]" />
                    <Label htmlFor="user" className="font-normal cursor-pointer text-slate-700 flex-1">
                      <span className="font-medium">Find a job</span>
                      <span className="block text-sm text-slate-500">I&apos;m looking for employment opportunities</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="lembaga" id="lembaga" className="border-[#ff6154] text-[#ff6154]" />
                    <Label htmlFor="lembaga" className="font-normal cursor-pointer text-slate-700 flex-1">
                      <span className="font-medium">Post jobs</span>
                      <span className="block text-sm text-slate-500">I represent a company/organization</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Tanaka Hiroshi"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tanaka@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number <span className="text-slate-400">(Optional)</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="repeat-password" className="text-slate-700 font-medium">Confirm Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="Repeat your password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-11 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:border-[#ff6154] focus:ring-2 focus:ring-[#ff6154]/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] hover:from-[#1e2a5a] hover:to-[#2B3E7C] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#ff6154] hover:text-[#ff4438] font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Japanese Elements */}
      <div className="text-center text-white/60 text-xs">
        <p>よろしくお願いします • よろしくおねがいします • Yoroshiku onegaishimasu</p>
      </div>
    </div>
  );
}
