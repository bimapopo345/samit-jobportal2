import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Building2, Shield, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";

export default async function AdminUsersPage() {
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

  // Get all users with their organizations
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      organizations!organizations_owner_id_fkey (
        id,
        display_name,
        verification_status
      )
    `)
    .order("created_at", { ascending: false });

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': 'bg-red-100 text-red-800',
      'lembaga': 'bg-blue-100 text-blue-800',
      'user': 'bg-green-100 text-green-800'
    };
    
    const icons = {
      'admin': Shield,
      'lembaga': Building2,
      'user': User
    };

    const Icon = icons[role as keyof typeof icons] || User;

    return (
      <Badge className={variants[role as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        <Icon className="h-3 w-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getVerificationBadge = (organizations: any[]) => {
    if (!organizations || organizations.length === 0) return null;
    
    const org = organizations[0];
    const variants = {
      'verified': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[org.verification_status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {org.verification_status}
      </Badge>
    );
  };

  const userStats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    lembaga: users?.filter(u => u.role === 'lembaga').length || 0,
    users: users?.filter(u => u.role === 'user').length || 0,
    verified_orgs: users?.filter(u => u.organizations && u.organizations[0]?.verification_status === 'verified').length || 0
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
        <p className="text-gray-600">
          Kelola semua pengguna dan organisasi di platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold">{userStats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lembaga</p>
                <p className="text-2xl font-bold">{userStats.lembaga}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Job Seekers</p>
                <p className="text-2xl font-bold">{userStats.users}</p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Orgs</p>
                <p className="text-2xl font-bold">{userStats.verified_orgs}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((userProfile) => (
                <TableRow key={userProfile.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {userProfile.full_name || 'No name set'}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {userProfile.id.substring(0, 8)}...
                      </div>
                      {userProfile.phone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {userProfile.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(userProfile.role)}
                  </TableCell>
                  <TableCell>
                    {userProfile.organizations && userProfile.organizations.length > 0 ? (
                      <div>
                        <div className="font-medium">
                          {userProfile.organizations[0].display_name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getVerificationBadge(userProfile.organizations)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(userProfile.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}