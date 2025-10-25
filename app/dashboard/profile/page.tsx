import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
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

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
            <p className="text-slate-600 mt-1">
              Kelola informasi profil dan media sosial Anda
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] h-1" />
        <div className="p-8">
          <ProfileForm profile={profile} userEmail={user.email} />
        </div>
      </div>
    </div>
  );
}
