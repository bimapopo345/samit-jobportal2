import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default async function AdminOverviewPage() {
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

  // Get statistics
  const [
    { count: totalUsers },
    { count: totalOrgs },
    { count: pendingOrgs },
    { count: verifiedOrgs },
    { count: totalJobs },
    { count: activeJobs },
    { count: totalApplications },
    { count: totalClasses },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase
      .from("organizations")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("organizations")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified"),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("classes").select("*", { count: "exact", head: true }),
  ]);

  // Get recent activities
  const { data: recentOrgs } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentJobs } = await supabase
    .from("jobs")
    .select("*, organizations!inner(display_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Organizations",
      value: totalOrgs || 0,
      icon: Building2,
      color: "text-green-500",
      bgColor: "bg-green-50",
      detail: `${verifiedOrgs || 0} verified`,
    },
    {
      title: "Pending Verification",
      value: pendingOrgs || 0,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Active Jobs",
      value: activeJobs || 0,
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      detail: `${totalJobs || 0} total`,
    },
    {
      title: "Applications",
      value: totalApplications || 0,
      icon: FileText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Classes",
      value: totalClasses || 0,
      icon: GraduationCap,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.detail && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.detail}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Organizations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrgs?.map((org) => (
                <div key={org.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{org.display_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(org.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div>
                    {org.verification_status === "verified" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {org.verification_status === "pending" && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    {org.verification_status === "rejected" && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
              {(!recentOrgs || recentOrgs.length === 0) && (
                <p className="text-sm text-gray-500">No organizations yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs?.map((job) => (
                <div key={job.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.organizations?.display_name} •{" "}
                      {new Date(job.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentJobs || recentJobs.length === 0) && (
                <p className="text-sm text-gray-500">No jobs posted yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
