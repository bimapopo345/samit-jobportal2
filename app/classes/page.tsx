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
  DollarSign,
  Search,
  Globe,
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
      kaiwa: { label: "Kaiwa", color: "bg-blue-100 text-blue-800" },
      intensif: { label: "Intensif", color: "bg-purple-100 text-purple-800" },
      jlpt: { label: "JLPT", color: "bg-green-100 text-green-800" },
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
      <main className="flex-1 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
        {/* Page Header - COLORFUL */}
        <section className="bg-gradient-to-br from-emerald-400 via-teal-400 to-green-400 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300/30 rounded-full blur-3xl animate-pulse delay-700"></div>
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <GraduationCap className="h-5 w-5 text-white" />
                <span className="text-sm font-bold text-white">Pembelajaran Terbaik</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
                🎌 Kelas Bahasa Jepang
              </h1>
              <p className="text-xl text-white/95 font-medium">
                Tingkatkan kemampuan bahasa Jepang dengan instruktur berpengalaman dari SAMIT
              </p>
            </div>
          </div>
        </section>

        {/* Filters - COLORFUL */}
        <section className="container mx-auto max-w-6xl px-4 py-8">
          <form className="flex flex-col sm:flex-row gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100" action="/classes" method="get">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
              <Input
                type="text"
                name="search"
                placeholder="🔍 Cari kelas impian Anda..."
                defaultValue={searchParams.search}
                className="pl-10 h-12 border-green-200 focus:border-green-400 font-medium text-gray-800 bg-white/80"
              />
            </div>
            
            <Select name="type" defaultValue={searchParams.type || "all"}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipe Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="kaiwa">Kaiwa</SelectItem>
                <SelectItem value="intensif">Intensif</SelectItem>
                <SelectItem value="jlpt">JLPT</SelectItem>
              </SelectContent>
            </Select>

            {searchParams.type === 'jlpt' && (
              <Select name="level" defaultValue={searchParams.level || "all"}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
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
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Search className="mr-2 h-4 w-4" />
              Cari Kelas
            </Button>
            
            {(searchParams.type || searchParams.level || searchParams.search) && (
              <Button type="button" variant="outline" asChild className="border-green-300 text-green-700 hover:bg-green-50 font-semibold">
                <Link href="/classes">
                  ↻ Reset
                </Link>
              </Button>
            )}
          </form>
        </section>

        {/* Classes Grid */}
        <section className="container mx-auto max-w-6xl px-4 pb-12">
          {classes && classes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link key={cls.id} href={`/classes/${cls.slug}`}>
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full">
                      {/* Class Image */}
                      {cls.image_url ? (
                        <img
                          src={cls.image_url}
                          alt={cls.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center">
                          <GraduationCap className="h-16 w-16 text-white/50" />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Title and Type */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                            {cls.title}
                          </h3>
                          {getClassTypeBadge(cls.class_type)}
                        </div>

                        {/* JLPT Level Badge */}
                        {cls.jlpt_level && (
                          <Badge variant="outline" className="mb-3">
                            JLPT {cls.jlpt_level}
                          </Badge>
                        )}

                        {/* Description */}
                        {cls.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {cls.description}
                          </p>
                        )}

                        {/* Class Info */}
                        <div className="space-y-2 text-sm text-gray-500">
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
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Biaya:</span>
                            <span className="font-semibold text-brand-primary">
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

              {/* Pagination - COLORFUL */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg">
                  {page > 1 && (
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-green-300 text-green-700 hover:bg-green-100 font-bold"
                    >
                      <Link href={`/classes?page=${page - 1}${
                        searchParams.type ? `&type=${searchParams.type}` : ''
                      }${
                        searchParams.level ? `&level=${searchParams.level}` : ''
                      }${
                        searchParams.search ? `&search=${searchParams.search}` : ''
                      }`}>
                        Previous
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
                    <Button variant="outline" asChild>
                      <Link href={`/classes?page=${page + 1}${
                        searchParams.type ? `&type=${searchParams.type}` : ''
                      }${
                        searchParams.level ? `&level=${searchParams.level}` : ''
                      }${
                        searchParams.search ? `&search=${searchParams.search}` : ''
                      }`}>
                        Next
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Tidak ada kelas yang ditemukan</p>
              {(searchParams.search || searchParams.type || searchParams.level) && (
                <Button asChild variant="outline">
                  <Link href="/classes">Lihat Semua Kelas</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
