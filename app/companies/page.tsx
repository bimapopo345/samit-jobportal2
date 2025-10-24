import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Search,
  Briefcase,
} from "lucide-react";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1");
  const itemsPerPage = 12;
  const offset = (page - 1) * itemsPerPage;

  // Build query
  let query = supabase
    .from('organizations')
    .select(`
      *,
      jobs:jobs(count)
    `, { count: 'exact' })
    .eq('verification_status', 'verified')
    .order('created_at', { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`display_name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const { data: organizations, count } = await query;
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  // Get active jobs count for each org
  const orgIds = organizations?.map(org => org.id) || [];
  const { data: jobCounts } = await supabase
    .from('jobs')
    .select('org_id')
    .in('org_id', orgIds)
    .eq('is_active', true);

  const jobCountMap = jobCounts?.reduce((acc, job) => {
    acc[job.org_id] = (acc[job.org_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 min-h-screen">
        {/* Page Header - COLORFUL GRADIENT */}
        <section className="bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Building2 className="h-5 w-5 text-white" />
                <span className="text-sm font-bold text-white">Perusahaan Partner</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">Daftar Perusahaan</h1>
              <p className="text-xl text-white/95 font-medium">
                {count ? `🌟 ${count} perusahaan terverifikasi siap merekrut Anda!` : '🔍 Mencari perusahaan terbaik...'}
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar - COLORFUL */}
        <section className="container mx-auto max-w-6xl px-4 py-8">
          <form className="flex gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-purple-100" action="/companies" method="get">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-purple-500" />
              <Input
                type="text"
                name="search"
                placeholder="🔍 Cari perusahaan impian Anda..."
                defaultValue={searchParams.search}
                className="pl-10 h-12 border-purple-200 focus:border-purple-400 font-medium text-gray-800 bg-white/80"
              />
            </div>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Search className="mr-2 h-4 w-4" />
              Cari Perusahaan
            </Button>
          </form>
        </section>

        {/* Companies Grid - COLORFUL */}
        <section className="container mx-auto max-w-6xl px-4 pb-12 bg-white/30 backdrop-blur-sm rounded-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-gray-900">
              🏢 Temukan{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perusahaan Terbaik
              </span>
            </h2>
          </div>
          
          {organizations && organizations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {organizations.map((org, index) => {
                  const gradients = [
                    "from-blue-50 to-indigo-50",
                    "from-purple-50 to-pink-50",
                    "from-green-50 to-emerald-50",
                    "from-orange-50 to-red-50",
                    "from-cyan-50 to-teal-50",
                    "from-yellow-50 to-amber-50",
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <Link key={org.id} href={`/companies/${org.slug}`}>
                      <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 p-6 h-full border border-white/50`}>
                        {/* Company Header */}
                        <div className="flex items-start gap-4 mb-4">
                          {org.logo_url ? (
                            <img
                              src={org.logo_url}
                              alt={org.display_name}
                              className="h-16 w-16 rounded-xl object-cover shadow-md border-2 border-white"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                              <Building2 className="h-8 w-8 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 line-clamp-1">
                              {org.display_name}
                            </h3>
                            {org.industry && (
                              <p className="text-sm text-gray-700 font-medium">{org.industry}</p>
                            )}
                          </div>
                        </div>

                      {/* Description */}
                      {org.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {org.description}
                        </p>
                      )}

                      {/* Company Info */}
                      <div className="space-y-2 text-sm text-gray-500">
                        {org.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{org.address}</span>
                          </div>
                        )}
                        {org.employee_count && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{org.employee_count} karyawan</span>
                          </div>
                        )}
                        {org.founded_year && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Sejak {org.founded_year}</span>
                          </div>
                        )}
                        {org.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="line-clamp-1">{org.website}</span>
                          </div>
                        )}
                      </div>

                        {/* Active Jobs Badge */}
                        <div className="mt-4 pt-4 border-t">
                          <Badge variant="secondary" className="w-full justify-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {jobCountMap[org.id] || 0} lowongan aktif
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination - COLORFUL */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg">
                  {page > 1 && (
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 font-bold"
                    >
                      <Link href={`/companies?page=${page - 1}${
                        searchParams.search ? `&search=${searchParams.search}` : ''
                      }`}>
                        ← Previous
                      </Link>
                    </Button>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="icon"
                          asChild
                          className={page === pageNum 
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold border-0 shadow-lg" 
                            : "border-purple-300 text-purple-700 hover:bg-purple-100 font-bold"
                          }
                        >
                          <Link href={`/companies?page=${pageNum}${
                            searchParams.search ? `&search=${searchParams.search}` : ''
                          }`}>
                            {pageNum}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  {page < totalPages && (
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 font-bold"
                    >
                      <Link href={`/companies?page=${page + 1}${
                        searchParams.search ? `&search=${searchParams.search}` : ''
                      }`}>
                        Next →
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-purple-400 mb-4" />
              <p className="text-gray-700 font-semibold mb-4">Tidak ada perusahaan yang ditemukan</p>
              {searchParams.search && (
                <Button 
                  asChild 
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100 font-bold"
                >
                  <Link href="/companies">🔄 Hapus Pencarian</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
