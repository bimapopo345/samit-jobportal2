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
      {/* Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Profil Saya</h1>
            <p className="text-gray-700 mt-1">
              Kelola informasi profil dan media sosial Anda
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary to-purple-600 h-2" />
        <div className="p-8">
          <ProfileForm profile={profile} userEmail={user.email} />
        </div>
      </div>
    </div>
  );
}
