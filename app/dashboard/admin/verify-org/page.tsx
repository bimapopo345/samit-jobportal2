import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ExternalLink,
  Download,
} from "lucide-react";
import { VerificationActions } from "@/components/admin/verification-actions";

export default async function VerifyOrgPage() {
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

  // Get organizations pending verification
  const { data: organizations } = await supabase
    .from("organizations")
    .select(`
      *,
      profiles!inner(full_name, email),
      organization_legal_docs(*)
    `)
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terverifikasi
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu Verifikasi
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verifikasi Organisasi</h1>
        <p className="text-gray-600">
          Review dan verifikasi organisasi yang mendaftar
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer">
          Semua ({organizations?.length || 0})
        </Badge>
        <Badge variant="outline" className="cursor-pointer bg-yellow-50">
          Pending ({organizations?.filter(o => o.verification_status === 'pending').length || 0})
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Verified ({organizations?.filter(o => o.verification_status === 'verified').length || 0})
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Rejected ({organizations?.filter(o => o.verification_status === 'rejected').length || 0})
        </Badge>
      </div>

      {/* Organizations List */}
      <div className="space-y-6">
        {organizations?.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {org.logo_url ? (
                    <img
                      src={org.logo_url}
                      alt={org.display_name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{org.display_name}</CardTitle>
                    <CardDescription>
                      Owner: {org.profiles?.full_name} ({org.profiles?.email})
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(org.verification_status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Organization Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {org.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">{org.description}</p>
                  </div>
                )}
                
                {org.industry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Industry:</span>
                    <span>{org.industry}</span>
                  </div>
                )}
                
                {org.employee_count && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Employees:</span>
                    <span>{org.employee_count}</span>
                  </div>
                )}
                
                {org.founded_year && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Founded:</span>
                    <span>{org.founded_year}</span>
                  </div>
                )}
                
                {org.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${org.email}`} className="text-brand-primary hover:underline">
                      {org.email}
                    </a>
                  </div>
                )}
                
                {org.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span>{org.phone}</span>
                  </div>
                )}
                
                {org.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Website:</span>
                    <a 
                      href={org.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline flex items-center gap-1"
                    >
                      {org.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                {org.address && (
                  <div className="flex items-start gap-2 text-sm md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-medium">Address:</span>
                      <span className="ml-1">{org.address}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Legal Documents */}
              {org.organization_legal_docs && org.organization_legal_docs.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Legal Documents</h4>
                  <div className="space-y-2">
                    {org.organization_legal_docs.map((doc: { id: string; title: string; file_url: string }) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{doc.title}</span>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Notes */}
              {org.verification_notes && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Verification Notes</h4>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {org.verification_notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <VerificationActions 
                organizationId={org.id}
                currentStatus={org.verification_status}
              />
            </CardContent>
          </Card>
        ))}
        
        {(!organizations || organizations.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No organizations to review</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
