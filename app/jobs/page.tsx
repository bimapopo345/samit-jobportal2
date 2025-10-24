import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Briefcase, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 30; // Revalidate cache every 30 seconds

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { 
    category?: string;
    jlpt?: string;
    employment?: string;
    location?: string;
    search?: string;
    page?: string;
  }
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1");
  const itemsPerPage = 12;
  const offset = (page - 1) * itemsPerPage;

  // Build query
  let query = supabase
    .from('jobs')
    .select('*, organizations!inner(*)', { count: 'exact' })
    .eq('is_active', true)
    .eq('organizations.verification_status', 'verified')
    .order('created_at', { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  // Apply filters
  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  if (searchParams.jlpt) {
    query = query.eq('jlpt_required', searchParams.jlpt);
  }
  if (searchParams.employment) {
    query = query.eq('employment_type', searchParams.employment);
  }
  if (searchParams.location) {
    query = query.ilike('location_city', `%${searchParams.location}%`);
  }
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const { data: jobs, count } = await query;
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
        {/* Page Header - COLORFUL */}
        <section className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse delay-700"></div>
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Briefcase className="h-5 w-5 text-white" />
                <span className="text-sm font-bold text-white">Karir Impian Menanti</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
                💼 Lowongan Kerja
              </h1>
              <p className="text-xl text-white/95 font-medium">
                {count ? `🚀 ${count} lowongan tersedia untuk Anda!` : '🔍 Mencari lowongan terbaik...'}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black text-gray-900">
              🎯 Temukan{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pekerjaan Sempurna
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - COLORFUL */}
            <aside className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-lg border border-blue-100">
                <div className="mb-4 font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Filter Pencarian
                </div>
                <JobFilters />
              </div>
            </aside>

            {/* Job Listings - ENHANCED */}
            <section className="lg:col-span-3">
              {jobs && jobs.length > 0 ? (
                <>
                  <div className="grid gap-6">
                    {jobs.map((job) => (
                      <div key={job.id} className="hover:scale-[1.02] transition-transform duration-200">
                        <JobCard job={job} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination - COLORFUL */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page === 1}
                        asChild
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 font-bold"
                      >
                        <Link href={`/jobs?page=${page - 1}${
                          searchParams.category ? `&category=${searchParams.category}` : ''
                        }${
                          searchParams.jlpt ? `&jlpt=${searchParams.jlpt}` : ''
                        }${
                          searchParams.employment ? `&employment=${searchParams.employment}` : ''
                        }${
                          searchParams.location ? `&location=${searchParams.location}` : ''
                        }${
                          searchParams.search ? `&search=${searchParams.search}` : ''
                        }`}>
                          <ChevronLeft className="h-4 w-4" />
                        </Link>
                      </Button>

                      {/* Page numbers */}
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
                            >
                              <Link href={`/jobs?page=${pageNum}${
                                searchParams.category ? `&category=${searchParams.category}` : ''
                              }${
                                searchParams.jlpt ? `&jlpt=${searchParams.jlpt}` : ''
                              }${
                                searchParams.employment ? `&employment=${searchParams.employment}` : ''
                              }${
                                searchParams.location ? `&location=${searchParams.location}` : ''
                              }${
                                searchParams.search ? `&search=${searchParams.search}` : ''
                              }`}>
                                {pageNum}
                              </Link>
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={page === totalPages}
                        asChild
                      >
                        <Link href={`/jobs?page=${page + 1}${
                          searchParams.category ? `&category=${searchParams.category}` : ''
                        }${
                          searchParams.jlpt ? `&jlpt=${searchParams.jlpt}` : ''
                        }${
                          searchParams.employment ? `&employment=${searchParams.employment}` : ''
                        }${
                          searchParams.location ? `&location=${searchParams.location}` : ''
                        }${
                          searchParams.search ? `&search=${searchParams.search}` : ''
                        }`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Tidak ada lowongan yang ditemukan</p>
                  <Button asChild variant="outline">
                    <Link href="/jobs">Hapus Filter</Link>
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
