import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobForm } from "@/components/dashboard/job-form";

export default async function NewJobPage() {
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

  // Get organization (or create default for admin)
  let organization;
  
  if (profile?.role === 'admin') {
    // Admin can use default SAMIT organization or create their own
    const { data: adminOrg } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", "samit-admin")
      .single();
    
    if (!adminOrg) {
      // Create default admin organization
      const { data: newAdminOrg, error: createError } = await supabase
        .from("organizations")
        .insert({
          owner_id: user.id,
          slug: "samit-admin",
          display_name: "SAMIT Official",
          description: "Official SAMIT organization for admin job postings",
          email: user.email || "admin@samit.dev",
          verification_status: "verified",
          verified_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error("Error creating admin organization:", createError);
        organization = null;
      } else {
        organization = newAdminOrg;
      }
    } else {
      organization = adminOrg;
    }
  } else {
    // For lembaga, get their organization
    const { data: userOrg } = await supabase
      .from("organizations")
      .select("*")
      .eq("owner_id", user.id)
      .single();
    
    if (!userOrg) {
      redirect("/dashboard/org");
    }
    organization = userOrg;
  }

  // Check if verified (skip for admin)
  if (organization?.verification_status !== 'verified' && profile?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Organisasi Belum Terverifikasi
          </h2>
          <p className="text-yellow-700">
            Organisasi Anda harus diverifikasi terlebih dahulu sebelum dapat memposting lowongan kerja.
            Silakan lengkapi profil organisasi dan upload dokumen legal di halaman Dokumen Legal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Posting Lowongan Baru</h1>
        <p className="text-gray-600">
          Buat lowongan kerja baru untuk organisasi Anda
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {organization ? (
          <JobForm organizationId={organization.id} />
        ) : (
          <div className="text-center py-8">
            <p className="text-red-600">Error: Organization not found or could not be created.</p>
            <p className="text-gray-600 mt-2">Please try refreshing the page or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
}
