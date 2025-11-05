import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, Building2, MapPin, Calendar, DollarSign, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminJobsPage() {
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

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Get all jobs with organization details
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      *,
      organizations!inner (
        id,
        display_name,
        slug,
        verification_status,
        logo_url
      )
    `)
    .order("created_at", { ascending: false });

  const getStatusBadge = (isActive: boolean, publishedAt: string | null) => {
    if (!isActive) {
      return <Badge variant="secondary">Tidak Aktif</Badge>;
    }
    if (publishedAt) {
      return <Badge className="bg-green-100 text-green-800">Published</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      'jepang': 'bg-red-100 text-red-800',
      'dalam-negeri': 'bg-blue-100 text-blue-800',
      'ex-jepang': 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={variants[category as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {category.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Kelola Lowongan Kerja</h1>
          <p className="text-gray-600">
            Kelola semua lowongan kerja dari seluruh organisasi
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="bg-[#2B3E7C] hover:bg-[#1f2d5a]">
            <Plus className="h-4 w-4 mr-2" />
            Posting Lowongan Baru
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs?.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {job.organizations.logo_url && (
                    <img
                      src={job.organizations.logo_url}
                      alt={job.organizations.display_name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{job.organizations.display_name}</span>
                      {job.organizations.verification_status === 'verified' && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(job.is_active, job.published_at)}
                      {getCategoryBadge(job.category)}
                      <Badge variant="outline">{job.employment_type}</Badge>
                      <Badge variant="outline">{job.location_type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/jobs/${job.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/jobs/${job.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{job.location_city || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>
                    {job.show_salary && job.salary_min && job.salary_max
                      ? `¥${job.salary_min.toLocaleString()} - ¥${job.salary_max.toLocaleString()}`
                      : 'Salary not disclosed'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Posted: {new Date(job.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>Applications: {job.applications_count || 0}</span>
                <span>Views: {job.views_count || 0}</span>
                {job.jlpt_required && (
                  <Badge variant="outline">JLPT {job.jlpt_required} Required</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!jobs || jobs.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada lowongan kerja
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan membuat lowongan kerja pertama
              </p>
              <Link href="/dashboard/jobs/new">
                <Button className="bg-[#2B3E7C] hover:bg-[#1f2d5a]">
                  <Plus className="h-4 w-4 mr-2" />
                  Posting Lowongan Baru
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}