import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicantsFilter } from "@/components/dashboard/applicants-filter";
import { ApplicantStatusUpdater } from "@/components/dashboard/applicant-status-updater";
import { Users, Download, Eye, Mail, Calendar, Phone, Briefcase, Star } from "lucide-react";
import Link from "next/link";

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: { job?: string }
}) {
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

  // Get jobs for filter dropdown
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("org_id", organization.id)
    .order("created_at", { ascending: false });

  // Build query for applications
  let query = supabase
    .from("applications")
    .select(`
      *,
      profiles!inner (
        id,
        full_name,
        email,
        phone,
        bio
      ),
      jobs!inner (
        id,
        title,
        slug,
        org_id
      )
    `)
    .eq("jobs.org_id", organization.id)
    .order("applied_at", { ascending: false });

  // Filter by job if specified
  if (searchParams.job) {
    query = query.eq("job_id", searchParams.job);
  }

  const { data: applications } = await query;

  const selectedJob = searchParams.job 
    ? jobs?.find(j => j.id === searchParams.job)
    : null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { 
        label: "📝 Baru", 
        className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold" 
      },
      shortlisted: { 
        label: "⭐ Shortlist", 
        className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold" 
      },
      interview: { 
        label: "🎯 Interview", 
        className: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold" 
      },
      rejected: { 
        label: "❌ Ditolak", 
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold" 
      },
      hired: { 
        label: "✅ Diterima", 
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold" 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Stats
  const totalApplicants = applications?.length || 0;
  const hiredCount = applications?.filter(a => a.status === 'hired').length || 0;
  const shortlistedCount = applications?.filter(a => a.status === 'shortlisted').length || 0;

  return (
    <div className="max-w-7xl">
      {/* Header with Gradient - COLORFUL */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Kelola Pelamar</h1>
            <p className="text-gray-700 font-semibold mt-1">
              Review dan kelola pelamar untuk lowongan Anda
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{totalApplicants}</p>
                <p className="text-sm text-gray-700 font-bold">Total Pelamar</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-pink-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{shortlistedCount}</p>
                <p className="text-sm text-gray-700 font-bold">Shortlisted</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{hiredCount}</p>
                <p className="text-sm text-gray-700 font-bold">Diterima</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter - COLORFUL */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1">
          <ApplicantsFilter jobs={jobs} currentJobId={searchParams.job} />
        </div>
        {selectedJob && (
          <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
            <span className="text-sm font-bold text-gray-700">Filter: </span>
            <span className="text-base font-black text-purple-800">{selectedJob.title}</span>
          </div>
        )}
      </div>

      {/* Applications List - COLORFUL */}
      {applications && applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((application, index) => {
            const gradients = [
              "from-blue-50 to-indigo-50 border-blue-200",
              "from-purple-50 to-pink-50 border-purple-200",
              "from-green-50 to-emerald-50 border-green-200",
              "from-orange-50 to-yellow-50 border-orange-200",
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <div key={application.id} className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl border-2 p-6 hover:shadow-2xl transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    {/* Avatar - COLORFUL */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {application.profiles?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    
                    {/* Applicant Info - ENHANCED */}
                    <div>
                      <h3 className="font-black text-xl text-gray-900">
                        {application.profiles?.full_name || "Unnamed"}
                      </h3>
                      <p className="text-gray-700 font-bold text-base">
                        💼 Melamar untuk: <span className="text-purple-700">{application.jobs?.title}</span>
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {application.profiles?.email && (
                          <span className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-800 text-sm">{application.profiles.email}</span>
                          </span>
                        )}
                        {application.profiles?.phone && (
                          <span className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-gray-800 text-sm">{application.profiles.phone}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-gray-800 text-sm">
                            {new Date(application.applied_at).toLocaleDateString('id-ID')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status - COLORFUL */}
                  {getStatusBadge(application.status)}
                </div>

                {/* Bio - ENHANCED */}
                {application.profiles?.bio && (
                  <div className="mb-4 p-4 bg-white/60 rounded-xl border border-purple-200">
                    <p className="font-bold text-gray-900 mb-2">📝 Bio:</p>
                    <p className="text-gray-800 font-semibold">{application.profiles.bio}</p>
                  </div>
                )}

                {/* Cover Letter - ENHANCED */}
                {application.cover_letter && (
                  <div className="mb-4 p-4 bg-white/60 rounded-xl border border-blue-200">
                    <p className="font-bold text-gray-900 mb-2">💌 Surat Lamaran:</p>
                    <div className="text-gray-800 font-semibold whitespace-pre-wrap">
                      {application.cover_letter.substring(0, 200)}
                      {application.cover_letter.length > 200 && "..."}
                    </div>
                  </div>
                )}

                {/* Actions - COLORFUL */}
                <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-white/50">
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg"
                  >
                    <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />
                      Download CV
                    </a>
                  </Button>
                  
                  <ApplicantStatusUpdater 
                    applicationId={application.id}
                    currentStatus={application.status}
                  />
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 font-bold"
                  >
                    <Link href={`/dashboard/applicants/${application.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border-2 border-purple-200 p-16 text-center">
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Belum Ada Pelamar</h3>
          <p className="text-gray-700 font-semibold max-w-md mx-auto">
            {searchParams.job 
              ? "Belum ada pelamar untuk lowongan ini. Tunggu kandidat terbaik melamar! 🎯"
              : "Belum ada pelamar untuk semua lowongan Anda. Pastikan lowongan Anda menarik! 🚀"
            }
          </p>
        </div>
      )}
    </div>
  );
}
