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
  Instagram,
  Linkedin,
  Facebook,
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
  searchParams: JobsPageSearchParams;
}) {
  const supabase = await createClient();
  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;
  const sortParam = searchParams.sort === "oldest" ? "oldest" : "newest";

  let query = supabase
    .from("jobs")
    .select("*, organizations!inner(*)", { count: "exact" })
    .eq("is_active", true)
    .eq("organizations.verification_status", "verified");

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.jlpt) {
    query = query.eq("jlpt_required", searchParams.jlpt);
  }

  if (searchParams.employment) {
    query = query.eq("employment_type", searchParams.employment);
  }

  if (searchParams.location) {
    query = query.ilike("location_city", `%${searchParams.location}%`);
  }

  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`
    );
  }

  const { data: jobs, count } = await query
    .order("created_at", { ascending: sortParam === "oldest" })
    .range(offset, offset + itemsPerPage - 1);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
  const totalJobsText = new Intl.NumberFormat("id-ID").format(count ?? 0);

  const baseParams = new URLSearchParams();
  if (searchParams.search) baseParams.set("search", searchParams.search);
  if (searchParams.location) baseParams.set("location", searchParams.location);
  if (searchParams.category) baseParams.set("category", searchParams.category);
  if (searchParams.jlpt) baseParams.set("jlpt", searchParams.jlpt);
  if (searchParams.employment)
    baseParams.set("employment", searchParams.employment);
  if (searchParams.sort) baseParams.set("sort", searchParams.sort);

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
                  initialSearch={searchParams.search}
                  initialLocation={searchParams.location}
                  initialCategory={searchParams.category}
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

            <div className="rounded-[32px] border border-slate-100 bg-white px-10 py-12 shadow-[0_40px_60px_-45px_rgba(15,23,42,0.25)]">
              <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f6bd8] to-[#2f3b8f] text-lg font-bold text-white shadow-lg">
                      KJ
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        KapanJepan
                      </p>
                      <p className="text-xs uppercase tracking-wide text-[#ff6154]">
                        Career Diversity Inc.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Enquiries</p>
                    <p>Career Diversity Inc. HQ</p>
                    <p>
                      Imon Asakusa Sushi-ya Dori Building 5th Floor Room 32,
                      1-13-5, Asakusa, Taito, Tokyo, Japan
                    </p>
                    <p className="pt-2">Email: contact@kapanjepan.com</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                    Connect
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#ff6154] hover:text-[#ff6154]"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#ff6154] hover:text-[#ff6154]"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.facebook.com"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#ff6154] hover:text-[#ff6154]"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                © 2024 KapanJepan. All Rights Reserved.
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
