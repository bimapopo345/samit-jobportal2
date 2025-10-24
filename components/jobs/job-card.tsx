import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, Globe, Banknote } from "lucide-react";

interface JobCardProps {
  job: any; // TODO: Add proper type from database
}

export function JobCard({ job }: JobCardProps) {
  const formatSalary = (min?: number, max?: number, currency: string = "JPY") => {
    if (!min && !max) return "Negosiasi";
    
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `Mulai dari ${formatter.format(min)}`;
    } else if (max) {
      return `Hingga ${formatter.format(max)}`;
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fulltime: "Full Time",
      parttime: "Part Time",
      intern: "Internship",
      contract: "Contract",
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "dalam-negeri": "Dalam Negeri",
      "jepang": "Di Jepang",
      "ex-jepang": "Ex-Jepang",
    };
    return labels[category] || category;
  };

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      onsite: "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
    };
    return labels[type] || type;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  };

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.organizations?.logo_url ? (
            <img
              src={job.organizations.logo_url}
              alt={job.organizations.display_name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1">
          <div className="mb-2">
            <Link href={`/jobs/${job.slug}`}>
              <h3 className="text-lg font-semibold hover:text-brand-primary transition-colors">
                {job.title}
              </h3>
            </Link>
            <Link href={`/companies/${job.organizations?.slug}`} className="text-gray-600 hover:text-gray-800">
              {job.organizations?.display_name}
            </Link>
          </div>

          {/* Job Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location_city || "Indonesia"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{getLocationTypeLabel(job.location_type)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getEmploymentTypeLabel(job.employment_type)}</span>
            </div>
            {job.show_salary && (job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-1">
                <Banknote className="h-4 w-4" />
                <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">
              {getCategoryLabel(job.category)}
            </Badge>
            {job.jlpt_required && (
              <Badge variant="outline">
                JLPT {job.jlpt_required}
              </Badge>
            )}
            {job.is_gijinkoku && (
              <Badge className="bg-green-100 text-green-800">
                Gijinkoku
              </Badge>
            )}
            {job.is_nihongo_gakkou && (
              <Badge className="bg-blue-100 text-blue-800">
                Nihongo Gakkou
              </Badge>
            )}
            {job.is_intensive_class_partner && (
              <Badge className="bg-purple-100 text-purple-800">
                Partner Kelas Intensif
              </Badge>
            )}
          </div>

          {/* Description Preview */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {job.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Diposting {timeAgo(job.created_at)}
            </span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/jobs/${job.slug}`}>Detail</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/apply/${job.slug}`}>Lamar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
