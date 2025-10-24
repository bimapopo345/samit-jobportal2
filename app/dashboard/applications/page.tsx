import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

export default async function ApplicationsPage() {
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

  // Get user's applications with job and organization details
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      jobs!inner (
        id,
        title,
        slug,
        location_city,
        employment_type,
        category,
        organizations!inner (
          display_name,
          logo_url
        )
      )
    `)
    .eq("applicant_id", user.id)
    .order("applied_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { 
        label: "Menunggu Review", 
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock 
      },
      shortlisted: { 
        label: "Shortlisted", 
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: AlertCircle 
      },
      interview: { 
        label: "Interview", 
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Calendar 
      },
      rejected: { 
        label: "Tidak Lolos", 
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle 
      },
      hired: { 
        label: "Diterima", 
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </div>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "dalam-negeri": "Dalam Negeri",
      "jepang": "Di Jepang",
      "ex-jepang": "Ex-Jepang",
    };
    return labels[category] || category;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fulltime: "Full Time",
      parttime: "Part Time",
      intern: "Internship",
      contract: "Contract",
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lamaran Saya</h1>
        <p className="text-gray-600 mt-2">
          Pantau status lamaran pekerjaan Anda
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Total Lamaran</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {applications?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-200/50 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">Shortlisted</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {applications?.filter(a => a.status === 'shortlisted').length || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-200/50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-900">Interview</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                {applications?.filter(a => a.status === 'interview').length || 0}
              </p>
            </div>
            <div className="p-3 bg-indigo-200/50 rounded-lg">
              <Calendar className="h-6 w-6 text-indigo-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Diterima</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {applications?.filter(a => a.status === 'hired').length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-200/50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <div 
              key={application.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Job Info */}
                <div className="flex gap-4">
                  {/* Company Logo */}
                  {application.jobs?.organizations?.logo_url ? (
                    <img
                      src={application.jobs.organizations.logo_url}
                      alt={application.jobs.organizations.display_name}
                      className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="flex-1">
                    <Link 
                      href={`/jobs/${application.jobs?.slug}`}
                      className="group flex items-center gap-2"
                    >
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-brand-primary transition-colors">
                        {application.jobs?.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-brand-primary" />
                    </Link>
                    <p className="text-gray-700 font-medium">
                      {application.jobs?.organizations?.display_name}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {application.jobs?.location_city || "Indonesia"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        {getEmploymentTypeLabel(application.jobs?.employment_type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(application.jobs?.category)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(application.status)}
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Dilamar {new Date(application.applied_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Status Notes */}
              {application.status_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Catatan:</span> {application.status_notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/jobs/${application.jobs?.slug}`}>
                    <FileText className="h-4 w-4 mr-1.5" />
                    Lihat Lowongan
                  </Link>
                </Button>
                {application.cv_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={application.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Lihat CV
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Lamaran</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Anda belum melamar pekerjaan apapun. Mulai cari pekerjaan impian Anda sekarang!
          </p>
          <Button asChild>
            <Link href="/jobs">
              Cari Lowongan
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
