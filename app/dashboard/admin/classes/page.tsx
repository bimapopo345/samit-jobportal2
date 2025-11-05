import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, Users, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminClassesPage() {
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

  // Get all classes
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: false });

  const getClassTypeBadge = (classType: string) => {
    const variants = {
      'jlpt': 'bg-blue-100 text-blue-800',
      'kaiwa': 'bg-green-100 text-green-800',
      'intensif': 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={variants[classType as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {classType.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean, startDate: string, endDate: string) => {
    if (!isActive) {
      return <Badge variant="secondary">Tidak Aktif</Badge>;
    }
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
    }
  };

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kelas Bahasa Jepang</h1>
          <p className="text-gray-600">
            Kelola semua kelas JLPT, Kaiwa, dan Intensif
          </p>
        </div>
        <Button className="bg-[#2B3E7C] hover:bg-[#1f2d5a]">
          <Plus className="h-4 w-4 mr-2" />
          Buat Kelas Baru
        </Button>
      </div>

      <div className="grid gap-6">
        {classes?.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {classItem.image_url && (
                    <img
                      src={classItem.image_url}
                      alt={classItem.title}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl mb-2">{classItem.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{classItem.instructor_name || 'Instructor TBA'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(classItem.is_active, classItem.start_date, classItem.end_date)}
                      {getClassTypeBadge(classItem.class_type)}
                      {classItem.jlpt_level && (
                        <Badge variant="outline">JLPT {classItem.jlpt_level}</Badge>
                      )}
                      {classItem.is_online ? (
                        <Badge className="bg-blue-100 text-blue-800">Online</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">Offline</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/classes/${classItem.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {classItem.start_date ? new Date(classItem.start_date).toLocaleDateString('id-ID') : 'TBA'}
                    {classItem.end_date && ` - ${new Date(classItem.end_date).toLocaleDateString('id-ID')}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{classItem.duration_hours || 0} jam</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{classItem.location || 'Location TBA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{classItem.enrolled_count || 0}/{classItem.max_students || '∞'} siswa</span>
                </div>
              </div>
              
              {classItem.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{classItem.description}</p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>
                  {classItem.price 
                    ? `¥${classItem.price.toLocaleString()} ${classItem.currency || 'JPY'}`
                    : 'Free'
                  }
                </span>
                <span>Schedule: {classItem.schedule || 'TBA'}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {!classes || classes.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada kelas
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan membuat kelas bahasa Jepang pertama
              </p>
              <Button className="bg-[#2B3E7C] hover:bg-[#1f2d5a]">
                <Plus className="h-4 w-4 mr-2" />
                Buat Kelas Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}