import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  Users, 
  BarChart3,
  Server,
  AlertTriangle
} from "lucide-react";

export default async function AdminSettingsPage() {
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

  // Get system stats
  const { data: systemStats } = await supabase.rpc('get_system_stats').single() || {};

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
        <p className="text-gray-600">
          Kelola konfigurasi platform dan sistem administratif
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  <Server className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  <Database className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                  <Bell className="h-3 w-3 mr-1" />
                  3 Pending
                </Badge>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Normal
                </Badge>
              </div>
              <Settings className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Site Name</p>
                <p className="text-sm text-gray-600">SAMIT - Sakura Mitra Indonesia</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Site URL</p>
                <p className="text-sm text-gray-600">https://samit.co.id</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Disabled</p>
              </div>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Registration</p>
                <p className="text-sm text-gray-600">Open for all users</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-gray-600">Required</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Auto Verification</p>
                <p className="text-sm text-gray-600">Organizations: Manual</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">SMTP Provider</p>
                <p className="text-sm text-gray-600">Supabase (Default)</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">From Email</p>
                <p className="text-sm text-gray-600">noreply@samit.co.id</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Templates</p>
                <p className="text-sm text-gray-600">5 templates configured</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics & Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-600">Not configured</p>
              </div>
              <Button variant="outline" size="sm">Setup</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Error Tracking</p>
                <p className="text-sm text-gray-600">Sentry integration</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Performance Monitoring</p>
                <p className="text-sm text-gray-600">Enabled</p>
              </div>
              <Button variant="outline" size="sm">View Stats</Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Dangerous Actions */}
      <Card className="mt-6 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Dangerous Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-800 mb-3">
              These actions are irreversible and should be used with extreme caution.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Reset All Data
              </Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Export Database
              </Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                System Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}