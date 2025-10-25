import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Users, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function JobsListPage() {
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

  if (profile?.role !== "lembaga" && profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Get organization
  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!organization) {
    redirect("/dashboard/org");
  }

  // Get jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("org_id", organization.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Lowongan Saya</h1>
              <p className="text-slate-600 mt-1">
                Kelola lowongan kerja yang telah Anda posting
              </p>
            </div>
          </div>
          <Button 
            asChild
            className="bg-gradient-to-r from-[#ff7a45] to-[#ff5555] hover:from-[#ff5555] hover:to-[#ff7a45] text-white font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Link href="/dashboard/jobs/new">
              <Plus className="mr-2 h-5 w-5" />
              Posting Lowongan Baru
            </Link>
          </Button>
        </div>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] h-1" />
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">Judul</TableHead>
                <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
                <TableHead className="font-semibold text-slate-900">Status</TableHead>
                <TableHead className="font-semibold text-slate-900">Pelamar</TableHead>
                <TableHead className="font-semibold text-slate-900">Dilihat</TableHead>
                <TableHead className="font-semibold text-slate-900">Dibuat</TableHead>
                <TableHead className="text-right font-semibold text-slate-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job, index) => (
                <TableRow key={job.id} className={index % 2 === 0 ? "bg-white/50" : "bg-blue-50/30"}>
                  <TableCell className="font-bold">
                    <Link 
                      href={`/jobs/${job.slug}`}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="text-sm text-gray-700 font-semibold mt-1">
                      📍 {job.location_city} • 💼 {job.employment_type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-bold ${
                      job.category === 'dalam-negeri' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                        : job.category === 'jepang' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}>
                      {job.category === 'dalam-negeri' ? '🏢 Dalam Negeri' :
                       job.category === 'jepang' ? '🇯🇵 Di Jepang' : '🌟 Ex-Jepang'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-bold ${
                      job.is_active 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                    }`}>
                      {job.is_active ? (
                        <><Eye className="h-4 w-4 mr-1" /> Aktif</>
                      ) : (
                        <><EyeOff className="h-4 w-4 mr-1" /> Nonaktif</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        {job.applications_count || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-900 text-lg">
                      👁️ {job.views_count || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-800">
                      {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        asChild
                        className="border-purple-300 hover:bg-purple-100 font-bold"
                      >
                        <Link href={`/dashboard/applicants?job=${job.id}`}>
                          <Users className="h-4 w-4 text-purple-600" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        asChild
                        className="border-blue-300 hover:bg-blue-100 font-bold"
                      >
                        <Link href={`/dashboard/jobs/${job.id}/edit`}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-200 p-16 text-center">
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg animate-pulse">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Belum Ada Lowongan</h3>
          <p className="text-gray-700 font-semibold mb-8 max-w-md mx-auto">
            Mulai posting lowongan pertama Anda untuk mendapatkan kandidat terbaik dari seluruh Indonesia dan Jepang! 🚀
          </p>
          <Button 
            asChild
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Link href="/dashboard/jobs/new">
              <Plus className="mr-2 h-5 w-5" />
              Posting Lowongan Pertama
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
