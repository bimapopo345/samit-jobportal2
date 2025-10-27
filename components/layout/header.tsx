"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Briefcase, Menu, X, Building2, GraduationCap, UserPlus, LogIn, LayoutDashboard } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="SAMIT Logo" 
                className="h-10 w-10 object-contain group-hover:scale-110 transition-all duration-200"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-xl text-[#2B3E7C]">SAMIT</div>
                <div className="text-xs text-slate-600 -mt-1">Sakura Mitra Indonesia</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all font-medium">
              <Briefcase className="h-4 w-4" />
              Lowongan
            </Link>
            <Link href="/companies" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all font-medium">
              <Building2 className="h-4 w-4" />
              Perusahaan
            </Link>
            <Link href="/classes" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all font-medium">
              <GraduationCap className="h-4 w-4" />
              Kelas
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center text-white font-bold text-sm">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium text-slate-900 text-sm hidden lg:inline">{profile?.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg p-1">
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard')} 
                    className="hover:bg-slate-50 cursor-pointer rounded-md p-2"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-[#2B3E7C]" />
                    <span className="font-medium text-slate-900">Dashboard</span>
                  </DropdownMenuItem>
                  {profile?.role === 'lembaga' && (
                    <DropdownMenuItem 
                      onClick={() => router.push('/dashboard/jobs/new')} 
                      className="hover:bg-slate-50 cursor-pointer rounded-md p-2"
                    >
                      <Briefcase className="mr-2 h-4 w-4 text-[#ff6154]" />
                      <span className="font-medium text-slate-900">Post Lowongan</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-200 my-1" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="hover:bg-red-50 cursor-pointer rounded-md p-2"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-700">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Masuk
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-[#ff7a45] to-[#ff5555] hover:from-[#ff5555] hover:to-[#ff7a45] text-white font-medium shadow-sm hover:shadow-md transition-all">
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
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center text-white font-bold text-sm">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <button
              className="p-2 rounded-lg hover:bg-slate-50 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <nav className="flex flex-col gap-2 px-4">
              <Link 
                href="/jobs" 
                className="text-sm font-medium text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Lowongan
                </div>
              </Link>
              <Link 
                href="/companies" 
                className="text-sm font-medium text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Perusahaan
                </div>
              </Link>
              <Link 
                href="/classes" 
                className="text-sm font-medium text-slate-700 hover:text-[#2B3E7C] hover:bg-slate-50 transition-all p-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Kelas
                </div>
              </Link>
              <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      asChild 
                      onClick={() => setMobileMenuOpen(false)}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="border-red-200 text-red-700 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">
                      <Link href="/auth/login">Masuk</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-[#ff7a45] to-[#ff5555] hover:from-[#ff5555] hover:to-[#ff7a45] text-white font-medium">
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
