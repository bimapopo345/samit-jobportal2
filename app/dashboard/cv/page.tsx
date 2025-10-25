import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CVManager } from "@/components/dashboard/cv-manager";

export default async function CVPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "user") {
    redirect("/dashboard");
  }

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kelola CV</h1>
            <p className="text-slate-600 mt-1">
              Upload dan kelola CV Anda untuk melamar pekerjaan
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{resumes?.length || 0}</p>
                <p className="text-sm text-slate-600 font-medium">Total CV</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#ff6154]/10 flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {resumes?.filter(r => r.id === profile?.default_cv_id).length || 0}
                </p>
                <p className="text-sm text-slate-600 font-medium">CV Default</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2B3E7C]/10 flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">5 MB</p>
                <p className="text-sm text-slate-600 font-medium">Max Size</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CVManager 
        initialResumes={resumes || []} 
        userId={user.id}
        defaultCvId={profile?.default_cv_id}
      />
    </div>
  );
}
