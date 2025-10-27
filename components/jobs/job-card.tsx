import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Banknote,
  Heart,
  Briefcase,
  LucideIcon,
  GraduationCap,
  Factory,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: any; // TODO: Add proper type from database
}

const CATEGORY_THEMES: Record<
  string,
  { icon: LucideIcon; bg: string; text: string; ring: string }
> = {
  "dalam-negeri": {
    icon: Factory,
    bg: "bg-[#e8f4ff]",
    text: "text-[#1f6bd8]",
    ring: "ring-[#b2d7ff]",
  },
  jepang: {
    icon: GraduationCap,
    bg: "bg-[#fff2e9]",
    text: "text-[#ff6a3d]",
    ring: "ring-[#ffd5c4]",
  },
  "ex-jepang": {
    icon: Briefcase,
    bg: "bg-[#f4e8ff]",
    text: "text-[#7c3aed]",
    ring: "ring-[#d7c0ff]",
  },
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  fulltime: "Full Time",
  parttime: "Part Time",
  intern: "Internship",
  contract: "Contract",
};

const LOCATION_TYPE_LABELS: Record<string, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

const CATEGORY_LABELS: Record<string, string> = {
  "dalam-negeri": "Dalam Negeri",
  jepang: "Di Jepang",
  "ex-jepang": "Ex-Jepang",
};

const formatSalary = (
  min?: number | null,
  max?: number | null,
  currency: string = "JPY"
) => {
  if (!min && !max) return null;

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) {
    return `Mulai dari ${formatter.format(min)}`;
  }
  if (max) {
    return `Hingga ${formatter.format(max)}`;
  }
  return null;
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

export function JobCard({ job }: JobCardProps) {
  const theme = CATEGORY_THEMES[job.category] ?? {
    icon: Briefcase,
    bg: "bg-[#f1f5f9]",
    text: "text-[#0f172a]",
    ring: "ring-[#cbd5f5]",
  };
  const Icon = theme.icon;
  const employmentLabel =
    EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type;
  const locationTypeLabel =
    LOCATION_TYPE_LABELS[job.location_type] ?? job.location_type;
  const categoryLabel =
    CATEGORY_LABELS[job.category] ?? job.category ?? "Kategori Lainnya";
  const salaryLabel = job.show_salary
    ? formatSalary(job.salary_min, job.salary_max, job.salary_currency)
    : null;

  return (
    <article className="group relative h-full rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_-24px_rgba(15,23,42,0.35)]">
      <div className="flex items-start gap-5">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ring-8 ${theme.bg} ${theme.text} ${theme.ring}`}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link
                href={`/jobs/${job.slug}`}
                className="block text-lg font-semibold text-slate-900 transition-colors hover:text-[#ff6154]"
              >
                {job.title}
              </Link>
              <p className="text-sm font-medium text-slate-500">
                {job.organizations?.display_name ?? "Perusahaan Rahasia"}
                {job.category && (
                  <>
                    {" "}
                    <span className="text-slate-400">•</span>{" "}
                    <span className="text-[#ff6154]">{categoryLabel}</span>
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              aria-label="Simpan lowongan"
              className="rounded-full bg-slate-100/70 p-2 text-slate-400 transition hover:bg-[#ffe5df] hover:text-[#ff6154]"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <p className="line-clamp-2 text-sm text-slate-500">
            {job.short_description ?? job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-[#ffe8e2] px-3 py-1 text-xs font-medium text-[#ff6154]">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {employmentLabel}
            </Badge>
            <Badge className="rounded-full bg-[#e5f4ff] px-3 py-1 text-xs font-medium text-[#1f6bd8]">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {job.location_city ?? "Lokasi fleksibel"}
            </Badge>
            {salaryLabel && (
              <Badge className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-medium text-[#047857]">
                <Banknote className="mr-1 h-3.5 w-3.5" />
                {salaryLabel}
              </Badge>
            )}
            {locationTypeLabel && (
              <Badge
                variant="outline"
                className="rounded-full border-[#ffd5c4] px-3 py-1 text-xs font-medium text-[#ff6a3d]"
              >
                {locationTypeLabel}
              </Badge>
            )}
            {job.jlpt_required && (
              <Badge
                variant="outline"
                className="rounded-full border-[#d6bcfa] px-3 py-1 text-xs font-medium text-[#7c3aed]"
              >
                JLPT {job.jlpt_required}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Diposting {timeAgo(job.created_at)}
            </span>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-slate-200 text-slate-600 hover:border-[#ff6154] hover:text-[#ff6154]"
              >
                <Link href={`/jobs/${job.slug}`}>Detail</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5555] px-5 text-white shadow-md hover:from-[#ff5555] hover:to-[#ff7a45]"
              >
                <Link href={`/apply/${job.slug}`}>Lamar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
