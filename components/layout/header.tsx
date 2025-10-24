"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Briefcase, User, Menu, X, Home, Building2, GraduationCap, Sparkles, UserPlus, LogIn, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-white via-purple-50/80 to-pink-50/80 backdrop-blur-md border-b-2 border-purple-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                SAMIT Jobs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/jobs" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-brand-primary hover:bg-blue-50 transition-all font-semibold">
              <Briefcase className="h-4 w-4" />
              Lowongan
            </Link>
            <Link href="/companies" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold">
              <Building2 className="h-4 w-4" />
              Perusahaan
            </Link>
            <Link href="/classes" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all font-semibold">
              <GraduationCap className="h-4 w-4" />
              Kelas
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/50 hover:shadow-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white/50">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="font-bold text-gray-900 text-base hidden sm:inline">{profile?.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-white to-purple-50 backdrop-blur border-2 border-purple-300 shadow-xl p-2">
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard')} 
                    className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 cursor-pointer rounded-lg mb-1 p-3"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="font-black text-gray-900 text-base">Dashboard</span>
                  </DropdownMenuItem>
                  {profile?.role === 'lembaga' && (
                    <DropdownMenuItem 
                      onClick={() => router.push('/dashboard/jobs/new')} 
                      className="hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 cursor-pointer rounded-lg mb-1 p-3"
                    >
                      <Briefcase className="mr-3 h-5 w-5 text-green-600" />
                      <span className="font-black text-gray-900 text-base">Post Lowongan</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gradient-to-r from-purple-200 to-pink-200 h-[2px] my-2" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 cursor-pointer rounded-lg p-3"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-600" />
                    <span className="font-black text-red-700 text-base">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Masuk
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <Link href="/auth/sign-up">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Daftar
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white/50">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <button
              className="p-2 rounded-lg hover:bg-white/50 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-200 bg-gradient-to-br from-white to-purple-50">
            <nav className="flex flex-col gap-3 px-4">
              <Link 
                href="/jobs" 
                className="text-base font-bold text-gray-900 hover:text-blue-600 hover:bg-blue-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Lowongan
                </div>
              </Link>
              <Link 
                href="/companies" 
                className="text-base font-bold text-gray-900 hover:text-purple-600 hover:bg-purple-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Perusahaan
                </div>
              </Link>
              <Link 
                href="/classes" 
                className="text-base font-bold text-gray-900 hover:text-green-600 hover:bg-green-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Kelas
                </div>
              </Link>
              <div className="pt-4 border-t border-purple-200 flex flex-col gap-3">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      asChild 
                      onClick={() => setMobileMenuOpen(false)}
                      className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 font-black text-gray-900 text-base"
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-5 w-5 mr-2 text-blue-600" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 font-black text-red-700 text-base"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/auth/login">Masuk</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/auth/sign-up">Daftar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
