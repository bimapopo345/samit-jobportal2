import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
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
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative isolate overflow-hidden bg-slate-900"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900/80" />
          
          <div className="relative z-10 px-4 py-20 sm:py-24">
            <div className="container mx-auto max-w-6xl text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Building2 className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">Partner Companies</span>
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-white mb-4">
                Temukan Perusahaan <span className="text-[#ff6154]">Terbaik</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {count ? `${count} perusahaan terverifikasi siap merekrut talenta terbaik Indonesia` : 'Mencari perusahaan terbaik untuk karir Anda'}
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto max-w-5xl px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <form className="flex gap-3" action="/companies" method="get">
              <div className="flex-1 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Cari nama perusahaan atau industri..."
                  defaultValue={searchParams.search}
                  className="h-12 rounded-full border border-transparent bg-slate-50 pl-12 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60"
                />
              </div>
              <Button 
                type="submit"
                className="h-12 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5555] px-6 text-sm font-semibold shadow-lg transition hover:from-[#ff5555] hover:to-[#ff7a45] hover:shadow-xl"
              >
                Cari
              </Button>
            </form>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="container mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Perusahaan Partner
            </h2>
            <p className="text-slate-600">
              Bergabunglah dengan perusahaan-perusahaan terkemuka di Indonesia
            </p>
          </div>
          
          {organizations && organizations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Link key={org.id} href={`/companies/${org.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 p-6 h-full border border-slate-100">
                      {/* Company Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {org.logo_url ? (
                          <img
                            src={org.logo_url}
                            alt={org.display_name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">
                            {org.display_name}
                          </h3>
                          {org.industry && (
                            <p className="text-sm text-slate-600">{org.industry}</p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {org.description && (
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                          {org.description}
                        </p>
                      )}

                      {/* Company Info */}
                      <div className="space-y-2 text-sm text-slate-500 mb-4">
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
                            <span className="line-clamp-1">{org.website.replace(/^https?:\/\//, '')}</span>
                          </div>
                        )}
                      </div>

                      {/* Active Jobs Badge */}
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                          <Briefcase className="h-4 w-4 text-[#ff6154]" />
                          <span className="font-medium">{jobCountMap[org.id] || 0} lowongan aktif</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {page > 1 && (
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
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
                            ? "bg-[#2B3E7C] text-white border-0 hover:bg-[#1e2a5a]" 
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
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
            <div className="text-center py-16">
              <Building2 className="mx-auto h-16 w-16 text-slate-400 mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tidak ada perusahaan yang ditemukan</h3>
              <p className="text-slate-600 mb-6">Coba gunakan kata kunci pencarian yang berbeda</p>
              {searchParams.search && (
                <Button 
                  asChild 
                  variant="outline"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <Link href="/companies">Hapus Pencarian</Link>
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-white border-t py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left - Logo & Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="SAMIT Logo" 
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-bold text-xl text-[#2B3E7C]">SAMIT</div>
                    <div className="text-sm text-gray-600">Sakura Mitra Indonesia</div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-4">Enquiries</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">Sakura Mitra Indonesia</p>
                  <p>Ruko Dalton Utara Blok DLNU 05</p>
                  <p>Jl. Scientia Square Selatan</p>
                  <p>Kelurahan Curug Sangereng, Kecamatan Klp. Dua</p>
                  <p>Kabupaten Tangerang, Banten 15810</p>
                  <p className="mt-4">Email: contact@sakuramitra.com</p>
                </div>
              </div>

              {/* Right - Connect */}
              <div className="text-right">
                <h3 className="font-bold text-lg mb-4">Connect</h3>
                <div className="flex gap-3 justify-end">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">📷</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">💼</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">📘</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom */}
            <div className="border-t pt-8 text-center text-sm text-gray-600">
              <p>© 2025 SAMIT - Sakura Mitra Indonesia. All Right Reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
