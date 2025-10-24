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
      {/* Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Kelola CV</h1>
            <p className="text-gray-700 mt-1">
              Upload dan kelola CV Anda untuk melamar pekerjaan
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{resumes?.length || 0}</p>
                <p className="text-sm text-gray-700 font-medium">Total CV</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes?.filter(r => r.id === profile?.default_cv_id).length || 0}
                </p>
                <p className="text-sm text-gray-700 font-medium">CV Default</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5 MB</p>
                <p className="text-sm text-gray-700 font-medium">Max Size</p>
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
