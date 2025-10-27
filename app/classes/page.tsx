import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  BookOpen,
  Video,
} from "lucide-react";

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: { 
    type?: string;
    level?: string;
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
    .from('classes')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('start_date', { ascending: true })
    .range(offset, offset + itemsPerPage - 1);

  // Apply filters
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('class_type', searchParams.type);
  }
  if (searchParams.level && searchParams.level !== 'all') {
    query = query.eq('jlpt_level', searchParams.level);
  }
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const { data: classes, count } = await query;
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  const formatPrice = (price: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getClassTypeBadge = (type: string) => {
    const typeConfig = {
      kaiwa: { label: "Kaiwa", color: "bg-blue-50 text-blue-700 border border-blue-200" },
      intensif: { label: "Intensif", color: "bg-purple-50 text-purple-700 border border-purple-200" },
      jlpt: { label: "JLPT", color: "bg-green-50 text-green-700 border border-green-200" },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.kaiwa;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative isolate overflow-hidden bg-slate-900"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900/80" />
          
          <div className="relative z-10 px-4 py-20 sm:py-24">
            <div className="container mx-auto max-w-6xl text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <GraduationCap className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">Japanese Language Learning</span>
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-white mb-4">
                Kelas Bahasa <span className="text-[#ff6154]">Jepang</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {count ? `${count} kelas tersedia untuk mengembangkan kemampuan bahasa Jepang Anda` : 'Tingkatkan kemampuan bahasa Jepang dengan instruktur berpengalaman dari SAMIT'}
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto max-w-5xl px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <form className="flex flex-col sm:flex-row gap-3" action="/classes" method="get">
              <div className="flex-1 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Cari kelas bahasa Jepang..."
                  defaultValue={searchParams.search}
                  className="h-12 rounded-full border border-transparent bg-slate-50 pl-12 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60"
                />
              </div>
              
              <Select name="type" defaultValue={searchParams.type || "all"}>
                <SelectTrigger className="w-full sm:w-40 h-12 rounded-full border border-transparent bg-slate-50 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60">
                  <SelectValue placeholder="Tipe Kelas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-100 shadow-xl">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="kaiwa">Kaiwa</SelectItem>
                  <SelectItem value="intensif">Intensif</SelectItem>
                  <SelectItem value="jlpt">JLPT</SelectItem>
                </SelectContent>
              </Select>

              {searchParams.type === 'jlpt' && (
                <Select name="level" defaultValue={searchParams.level || "all"}>
                  <SelectTrigger className="w-full sm:w-32 h-12 rounded-full border border-transparent bg-slate-50 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-100 shadow-xl">
                    <SelectItem value="all">Semua Level</SelectItem>
                    <SelectItem value="N5">N5</SelectItem>
                    <SelectItem value="N4">N4</SelectItem>
                    <SelectItem value="N3">N3</SelectItem>
                    <SelectItem value="N2">N2</SelectItem>
                    <SelectItem value="N1">N1</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button 
                type="submit"
                className="h-12 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5555] px-6 text-sm font-semibold shadow-lg transition hover:from-[#ff5555] hover:to-[#ff7a45] hover:shadow-xl"
              >
                Cari
              </Button>
              
              {(searchParams.type || searchParams.level || searchParams.search) && (
                <Button type="button" variant="outline" asChild className="h-12 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Link href="/classes">
                    Reset
                  </Link>
                </Button>
              )}
            </form>
          </div>
        </section>

        {/* Classes Grid */}
        <section className="container mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Kelas Tersedia
            </h2>
            <p className="text-slate-600">
              Pilih kelas yang sesuai dengan level dan kebutuhan Anda
            </p>
          </div>

          {classes && classes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link key={cls.id} href={`/classes/${cls.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden h-full border border-slate-100">
                      {/* Class Image */}
                      {cls.image_url ? (
                        <img
                          src={cls.image_url}
                          alt={cls.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
                          <GraduationCap className="h-16 w-16 text-white" />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Title and Type */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 flex-1">
                            {cls.title}
                          </h3>
                          {getClassTypeBadge(cls.class_type)}
                        </div>

                        {/* JLPT Level Badge */}
                        {cls.jlpt_level && (
                          <Badge variant="outline" className="mb-3 border-[#ff6154] text-[#ff6154]">
                            JLPT {cls.jlpt_level}
                          </Badge>
                        )}

                        {/* Description */}
                        {cls.description && (
                          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                            {cls.description}
                          </p>
                        )}

                        {/* Class Info */}
                        <div className="space-y-2 text-sm text-slate-500 mb-4">
                          {cls.instructor_name && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{cls.instructor_name}</span>
                            </div>
                          )}
                          
                          {(cls.start_date || cls.schedule) && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="line-clamp-1">
                                {cls.start_date 
                                  ? new Date(cls.start_date).toLocaleDateString('id-ID')
                                  : cls.schedule
                                }
                              </span>
                            </div>
                          )}

                          {cls.duration_hours && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{cls.duration_hours} jam</span>
                            </div>
                          )}

                          {cls.is_online ? (
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span>Online</span>
                            </div>
                          ) : cls.location ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{cls.location}</span>
                            </div>
                          ) : null}

                          {cls.max_students && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {cls.enrolled_count || 0}/{cls.max_students} peserta
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Biaya:</span>
                            <span className="font-semibold text-[#ff6154]">
                              {cls.price 
                                ? formatPrice(Number(cls.price), cls.currency)
                                : "Gratis"
                              }
                            </span>
                          </div>
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
                      <Link href={`/classes?page=${page - 1}${
                        searchParams.type ? `&type=${searchParams.type}` : ''
                      }${
                        searchParams.level ? `&level=${searchParams.level}` : ''
                      }${
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
                          <Link href={`/classes?page=${pageNum}${
                            searchParams.type ? `&type=${searchParams.type}` : ''
                          }${
                            searchParams.level ? `&level=${searchParams.level}` : ''
                          }${
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
                      <Link href={`/classes?page=${page + 1}${
                        searchParams.type ? `&type=${searchParams.type}` : ''
                      }${
                        searchParams.level ? `&level=${searchParams.level}` : ''
                      }${
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
              <GraduationCap className="mx-auto h-16 w-16 text-slate-400 mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tidak ada kelas yang ditemukan</h3>
              <p className="text-slate-600 mb-6">Coba gunakan filter yang berbeda atau ubah kata kunci pencarian</p>
              {(searchParams.search || searchParams.type || searchParams.level) && (
                <Button asChild variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Link href="/classes">Lihat Semua Kelas</Link>
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
