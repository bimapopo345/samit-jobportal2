import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { notFound, redirect } from "next/navigation";
import { ApplicationForm } from "@/components/application-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Building2,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  AlertCircle
} from "lucide-react";

export default async function ApplyPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirectTo=/apply/${params.slug}`);
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'user') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-800">
                Akses Ditolak
              </h2>
            </div>
            <p className="text-yellow-700">
              Hanya pengguna dengan role &quot;Pencari Kerja&quot; yang dapat melamar pekerjaan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get job details
  const { data: job } = await supabase
    .from('jobs')
    .select('*, organizations!inner(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!job) {
    notFound();
  }

  // Check if already applied
  const { data: existingApplication } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', job.id)
    .eq('applicant_id', user.id)
    .single();

  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Anda Sudah Melamar
            </h2>
            <p className="text-blue-700 mb-4">
              Anda sudah melamar untuk posisi ini pada {new Date(existingApplication.applied_at).toLocaleDateString('id-ID')}.
              Status lamaran: <span className="font-semibold">{existingApplication.status}</span>
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard/applications">Lihat Lamaran Saya</Link>
              </Button>
              <Button asChild>
                <Link href="/jobs">Cari Lowongan Lain</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get user's resumes
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  const formatSalary = (min?: number, max?: number, currency: string = "JPY") => {
    if (!min && !max) return "Negosiasi";
    
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `Mulai dari ${formatter.format(min)}`;
    } else if (max) {
      return `Hingga ${formatter.format(max)}`;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Job Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Lamar Pekerjaan</h1>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex gap-4 mb-3">
                {job.organizations?.logo_url ? (
                  <img
                    src={job.organizations.logo_url}
                    alt={job.organizations.display_name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{job.title}</h2>
                  <p className="text-gray-600">{job.organizations?.display_name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location_city || "Indonesia"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.employment_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.location_type}</span>
                </div>
                {job.show_salary && (job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <ApplicationForm 
            job={job}
            resumes={resumes || []}
            userId={user.id}
          />
        </div>
      </main>
    </>
  );
}
