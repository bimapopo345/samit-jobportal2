import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default async function MyClassesPage() {
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

  // Get user's class enrollments
  const { data: enrollments } = await supabase
    .from("class_enrollments")
    .select(`
      *,
      classes!inner (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      registered: { 
        label: "Terdaftar", 
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock 
      },
      confirmed: { 
        label: "Dikonfirmasi", 
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle 
      },
      cancelled: { 
        label: "Dibatalkan", 
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.registered;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </div>
    );
  };

  const getClassTypeBadge = (type: string) => {
    const typeConfig = {
      kaiwa: { label: "Kaiwa", color: "bg-blue-100 text-blue-800 border-blue-200" },
      intensif: { label: "Intensif", color: "bg-purple-100 text-purple-800 border-purple-200" },
      jlpt: { label: "JLPT", color: "bg-green-100 text-green-800 border-green-200" },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.kaiwa;
    return (
      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isClassActive = (startDate?: string, endDate?: string) => {
    if (!startDate) return true;
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (end && now > end) return false; // Class ended
    return true;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelas Saya</h1>
        <p className="text-gray-600 mt-2">
          Kelola kelas-kelas yang Anda ikuti
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Total Kelas</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {enrollments?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-200/50 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Aktif</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {enrollments?.filter(e => e.status === 'confirmed').length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-200/50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-900">Menunggu</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">
                {enrollments?.filter(e => e.status === 'registered').length || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-200/50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">JLPT</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {enrollments?.filter(e => e.classes?.class_type === 'jlpt').length || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-200/50 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      {enrollments && enrollments.length > 0 ? (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const cls = enrollment.classes;
            const isActive = isClassActive(cls?.start_date, cls?.end_date);
            
            return (
              <div 
                key={enrollment.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Class Info */}
                    <div className="flex gap-4 flex-1">
                      {/* Class Image/Icon */}
                      {cls?.image_url ? (
                        <img
                          src={cls.image_url}
                          alt={cls.title}
                          className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                      )}

                      {/* Class Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link 
                              href={`/classes/${cls?.slug}`}
                              className="group flex items-center gap-2"
                            >
                              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-brand-primary transition-colors">
                                {cls?.title}
                              </h3>
                              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-brand-primary" />
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              {getClassTypeBadge(cls?.class_type)}
                              {cls?.jlpt_level && (
                                <Badge variant="outline" className="text-xs">
                                  JLPT {cls.jlpt_level}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {cls?.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {cls.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          {cls?.instructor_name && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span>{cls.instructor_name}</span>
                            </div>
                          )}
                          
                          {cls?.start_date && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>
                                {new Date(cls.start_date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}

                          {cls?.duration_hours && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{cls.duration_hours} jam</span>
                            </div>
                          )}

                          {cls?.is_online ? (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Video className="h-4 w-4 text-gray-400" />
                              <span>Online</span>
                            </div>
                          ) : cls?.location ? (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{cls.location}</span>
                            </div>
                          ) : null}

                          {cls?.max_students && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{cls.enrolled_count || 0}/{cls.max_students} peserta</span>
                            </div>
                          )}

                          {cls?.price && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-brand-primary">
                                {formatPrice(Number(cls.price), cls.currency)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(enrollment.status)}
                      {!isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Kelas Selesai
                        </Badge>
                      )}
                      <div className="text-xs text-gray-500">
                        Terdaftar {new Date(enrollment.enrolled_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {enrollment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Catatan:</span> {enrollment.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {enrollment.status === 'confirmed' && cls?.meeting_link && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button size="sm" asChild>
                        <a href={cls.meeting_link} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-1.5" />
                          Join Kelas Online
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Kelas</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Anda belum terdaftar di kelas manapun. Tingkatkan kemampuan bahasa Jepang Anda dengan mengikuti kelas dari SAMIT!
          </p>
          <Button asChild>
            <Link href="/classes">
              Lihat Kelas
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
