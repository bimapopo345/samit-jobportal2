import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

type JobsPageSearchParams = {
  category?: string;
  jlpt?: string;
  employment?: string;
  location?: string;
  search?: string;
  page?: string;
  sort?: string;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<JobsPageSearchParams>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page ?? "1", 10));
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;
  const sortParam = resolvedSearchParams.sort === "oldest" ? "oldest" : "newest";

  // Get jobs with flexible organization filter to support admin jobs
  let query = supabase
    .from("jobs")
    .select("*, organizations!inner(*)", { count: "exact" })
    .eq("is_active", true);

  // Filter for verified organizations (includes admin organization)
  query = query.in("organizations.verification_status", ["verified"]);

  if (resolvedSearchParams.category) {
    query = query.eq("category", resolvedSearchParams.category);
  }

  if (resolvedSearchParams.jlpt) {
    query = query.eq("jlpt_required", resolvedSearchParams.jlpt);
  }

  if (resolvedSearchParams.employment) {
    query = query.eq("employment_type", resolvedSearchParams.employment);
  }

  if (resolvedSearchParams.location) {
    query = query.ilike("location_city", `%${resolvedSearchParams.location}%`);
  }

  if (resolvedSearchParams.search) {
    query = query.or(
      `title.ilike.%${resolvedSearchParams.search}%,description.ilike.%${resolvedSearchParams.search}%`
    );
  }

  const { data: jobs, count } = await query
    .order("created_at", { ascending: sortParam === "oldest" })
    .range(offset, offset + itemsPerPage - 1);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
  const totalJobsText = new Intl.NumberFormat("id-ID").format(count ?? 0);

  const baseParams = new URLSearchParams();
  if (resolvedSearchParams.search) baseParams.set("search", resolvedSearchParams.search);
  if (resolvedSearchParams.location) baseParams.set("location", resolvedSearchParams.location);
  if (resolvedSearchParams.category) baseParams.set("category", resolvedSearchParams.category);
  if (resolvedSearchParams.jlpt) baseParams.set("jlpt", resolvedSearchParams.jlpt);
  if (resolvedSearchParams.employment)
    baseParams.set("employment", resolvedSearchParams.employment);
  if (resolvedSearchParams.sort) baseParams.set("sort", resolvedSearchParams.sort);

  const createQueryString = (
    overrides: Record<string, string | number | null | undefined>
  ) => {
    const params = new URLSearchParams(baseParams.toString());
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    return params.toString();
  };

  const buildHref = (
    overrides: Record<string, string | number | null | undefined>
  ) => {
    const query = createQueryString(overrides);
    return query ? `/jobs?${query}` : "/jobs";
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f6f7fb]">
        <section
          className="relative isolate overflow-hidden bg-slate-900"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900/80" />

          <div className="relative z-10 px-4 py-20 sm:py-24">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 text-center">
              <div className="space-y-4 text-white">
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20 backdrop-blur">
                  Temukan pekerjaan impianmu
                </span>
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Find Your Dream Jobs
                </h1>
                <p className="text-base text-white/80 sm:text-lg">
                  {count && count > 0
                    ? `${totalJobsText} lowongan tersedia untuk kamu. Gunakan filter untuk menyesuaikan preferensi dan temukan peluang terbaikmu.`
                    : "Kami sedang menyiapkan lowongan terbaik untuk kamu. Coba ubah filter pencarian untuk hasil yang lebih luas."}
                </p>
              </div>

              <div className="mx-auto w-full max-w-4xl">
                <JobSearchBar
                  initialSearch={resolvedSearchParams.search}
                  initialLocation={resolvedSearchParams.location}
                  initialCategory={resolvedSearchParams.category}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-12 px-4 pb-16">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] bg-white/80 p-6 shadow-[0_40px_75px_-45px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Daftar lowongan
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {count && count > 0
                    ? `${totalJobsText} pekerjaan ditemukan`
                    : "Belum ada lowongan yang cocok"}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-slate-200 text-slate-600 hover:border-[#ff6154] hover:text-[#ff6154]"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl p-0">
                    <DialogHeader className="space-y-1 border-b border-slate-100 p-6 text-left">
                      <DialogTitle className="text-2xl font-semibold text-slate-900">
                        Filter lowongan
                      </DialogTitle>
                      <p className="text-sm text-slate-500">
                        Atur preferensi agar rekomendasi pekerjaan lebih sesuai
                        dengan kebutuhanmu.
                      </p>
                    </DialogHeader>
                    <div className="p-6">
                      <JobFilters layout="dialog" />
                    </div>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full border border-transparent bg-slate-900 text-white hover:bg-[#ff6154]">
                      Urutkan:{" "}
                      <span className="ml-1 font-semibold">
                        {sortParam === "oldest" ? "Terlama" : "Terbaru"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 rounded-xl border border-slate-100 shadow-xl">
                    <DropdownMenuItem asChild>
                    <Link
                      href={buildHref({
                        sort: null,
                        page: 1,
                      })}
                    >
                        Terbaru
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link
                      href={buildHref({
                        sort: "oldest",
                        page: 1,
                      })}
                    >
                        Terlama
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-12 text-center">
                  <h3 className="text-lg font-semibold text-slate-700">
                    Lowongan tidak ditemukan
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Coba atur ulang filter atau cari dengan kata kunci yang
                    berbeda.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 rounded-full border-[#ff6154] text-[#ff6154] hover:bg-[#fff1ed]"
                  >
                    <Link href="/jobs">Reset filter</Link>
                  </Button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                <span className="text-sm text-slate-500">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    asChild
                    className="rounded-full border-slate-300"
                  >
                    <Link
                      href={buildHref({
                        page: currentPage - 1,
                      })}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>

                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => {
                      let pageNumber = index + 1;

                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }
                      }

                      if (pageNumber < 1 || pageNumber > totalPages) {
                        return null;
                      }

                      const isActive = pageNumber === currentPage;

                      return (
                        <Button
                          key={pageNumber}
                          variant={isActive ? "default" : "outline"}
                          size="icon"
                          asChild
                          className={`rounded-full ${
                            isActive
                              ? "bg-[#ff6154] text-white hover:bg-[#ff4b3b]"
                              : "border-slate-300 text-slate-600 hover:border-[#ff6154] hover:text-[#ff6154]"
                          }`}
                        >
                          <Link
                            href={buildHref({
                              page: pageNumber,
                            })}
                          >
                            {pageNumber}
                          </Link>
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    asChild
                    className="rounded-full border-slate-300"
                  >
                    <Link
                      href={buildHref({
                        page: currentPage + 1,
                      })}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="rounded-[32px] bg-[#fff4df] px-10 py-12 text-center shadow-[0_30px_55px_-40px_rgba(255,97,84,0.6)]">
              <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Belum menemukan lowongan yang cocok?
              </h3>
              <p className="mt-3 text-base text-slate-600 sm:text-lg">
                Submit CV kamu dan dapatkan akses Free Membership. Kandidat
                terpilih akan kami undang untuk mengikuti proses job matching
                eksklusif.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5555] px-8 py-6 text-base font-semibold shadow-lg hover:from-[#ff5555] hover:to-[#ff7a45]"
              >
                <Link href="/auth/sign-up">Submit CV Sekarang</Link>
              </Button>
            </div>
          </div>
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
