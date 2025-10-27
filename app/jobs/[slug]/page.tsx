import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Building2, 
  Clock, 
  Globe, 
  Banknote,
  Calendar,
  Users,
  ChevronLeft,
  Share2,
  Heart
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: job } = await supabase
    .from('jobs')
    .select('*, organizations!inner(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('organizations.verification_status', 'verified')
    .single();

  if (!job) {
    notFound();
  }

  // Increment views count
  await supabase
    .from('jobs')
    .update({ views_count: (job.views_count || 0) + 1 })
    .eq('id', job.id);

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

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fulltime: "Full Time",
      parttime: "Part Time",
      intern: "Internship",
      contract: "Contract",
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "dalam-negeri": "Dalam Negeri",
      "jepang": "Di Jepang",
      "ex-jepang": "Ex-Jepang",
    };
    return labels[category] || category;
  };

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      onsite: "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
    };
    return labels[type] || type;
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/jobs" className="text-gray-600 hover:text-brand-primary flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Kembali ke Lowongan
              </Link>
            </div>
          </div>
        </div>

        {/* Job Header */}
        <section className="bg-white border-b">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex gap-4 mb-4">
                  {job.organizations?.logo_url ? (
                    <img
                      src={job.organizations.logo_url}
                      alt={job.organizations.display_name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                    <Link 
                      href={`/companies/${job.organizations?.slug}`}
                      className="text-lg text-brand-primary hover:underline"
                    >
                      {job.organizations?.display_name}
                    </Link>
                  </div>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location_city || "Indonesia"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{getLocationTypeLabel(job.location_type)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getEmploymentTypeLabel(job.employment_type)}</span>
                  </div>
                  {job.show_salary && (job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-1">
                      <Banknote className="h-4 w-4" />
                      <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {getCategoryLabel(job.category)}
                  </Badge>
                  {job.jlpt_required && (
                    <Badge variant="outline">
                      JLPT {job.jlpt_required}
                    </Badge>
                  )}
                  {job.is_gijinkoku && (
                    <Badge className="bg-green-100 text-green-800">
                      Gijinkoku
                    </Badge>
                  )}
                  {job.is_nihongo_gakkou && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Nihongo Gakkou
                    </Badge>
                  )}
                  {job.is_intensive_class_partner && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Partner Kelas Intensif
                    </Badge>
                  )}
                  {job.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-20 bg-gray-50 rounded-lg p-6 space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/apply/${job.slug}`}>
                      Lamar Sekarang
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-1" />
                      Simpan
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" />
                      Bagikan
                    </Button>
                  </div>
                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {job.application_deadline 
                        ? new Date(job.application_deadline).toLocaleDateString('id-ID')
                        : "Tidak ditentukan"
                      }</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{job.applications_count || 0} pelamar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Content */}
        <section className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Deskripsi Pekerjaan</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Persyaratan</h2>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Benefit & Fasilitas</h2>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                    {job.benefits}
                  </div>
                </div>
              )}
            </div>

            {/* Company Info Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Tentang Perusahaan</h3>
                <div className="space-y-3">
                  <Link 
                    href={`/companies/${job.organizations?.slug}`}
                    className="block hover:text-brand-primary transition-colors"
                  >
                    <div className="font-medium">{job.organizations?.display_name}</div>
                  </Link>
                  {job.organizations?.description && (
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {job.organizations.description}
                    </p>
                  )}
                  {job.organizations?.industry && (
                    <div className="text-sm">
                      <span className="text-gray-500">Industri:</span>
                      <span className="ml-1">{job.organizations.industry}</span>
                    </div>
                  )}
                  {job.organizations?.employee_count && (
                    <div className="text-sm">
                      <span className="text-gray-500">Karyawan:</span>
                      <span className="ml-1">{job.organizations.employee_count}</span>
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href={`/companies/${job.organizations?.slug}`}>
                      Lihat Profil Perusahaan
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
