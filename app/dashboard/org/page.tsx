import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrganizationForm } from "@/components/dashboard/organization-form";

export default async function OrgProfilePage() {
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

  if (profile?.role !== "lembaga" && profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Get or create organization
  let { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // If no organization exists, create one
  if (!organization && profile?.role === "lembaga") {
    const slug = `org-${user.id.substring(0, 8)}`;
    const { data: newOrg } = await supabase
      .from("organizations")
      .insert({
        owner_id: user.id,
        slug: slug,
        display_name: profile.full_name || "My Organization",
        verification_status: 'pending'
      })
      .select()
      .single();
    
    organization = newOrg;
  }

  return (
    <div className="max-w-5xl">
      {/* Header with Gradient - COLORFUL */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏢</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Profil Organisasi</h1>
            <p className="text-gray-700 font-semibold mt-1">
              Kelola informasi organisasi dan dokumen legal Anda
            </p>
          </div>
        </div>
        
        {organization?.verification_status && (
          <div className={`mt-6 inline-flex items-center px-5 py-2.5 rounded-full text-base font-bold shadow-lg ${
            organization.verification_status === 'verified' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : organization.verification_status === 'rejected'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
          }`}>
            {organization.verification_status === 'verified' ? '✅' : 
             organization.verification_status === 'rejected' ? '❌' : '⏳'} Status: {
              organization.verification_status === 'verified' ? 'Terverifikasi' :
              organization.verification_status === 'rejected' ? 'Ditolak' :
              'Menunggu Verifikasi'
            }
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2" />
        <div className="p-8">
          {organization && (
            <OrganizationForm organization={organization} />
          )}
        </div>
      </div>
    </div>
  );
}
