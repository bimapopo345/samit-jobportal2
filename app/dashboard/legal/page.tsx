import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LegalDocuments } from "@/components/dashboard/legal-documents";

export default async function LegalDocumentsPage() {
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

  // Get organization
  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!organization) {
    redirect("/dashboard/org");
  }

  return (
    <div className="max-w-5xl">
      {/* Header with Gradient - COLORFUL */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Dokumen Legal</h1>
            <p className="text-gray-700 font-semibold mt-1">
              Upload dokumen legal untuk verifikasi organisasi Anda
            </p>
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-700">Status Verifikasi:</p>
              <p className={`text-lg font-black ${
                organization.verification_status === 'verified' 
                  ? 'text-green-600' 
                  : organization.verification_status === 'rejected'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {organization.verification_status === 'verified' ? '✅ Terverifikasi' :
                 organization.verification_status === 'rejected' ? '❌ Ditolak' :
                 '⏳ Menunggu Verifikasi'}
              </p>
            </div>
            {organization.verification_status === 'rejected' && organization.verification_notes && (
              <div className="ml-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-bold text-red-900">Catatan Admin:</p>
                <p className="text-sm text-red-700 font-semibold mt-1">{organization.verification_notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LegalDocuments 
        organizationId={organization.id}
        currentDocuments={organization.legal_documents || {}}
        verificationStatus={organization.verification_status}
      />
    </div>
  );
}
