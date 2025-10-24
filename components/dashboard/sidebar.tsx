"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  Settings,
  Shield,
  CheckCircle,
  BarChart3,
  Upload,
  List,
  UserCheck,
} from "lucide-react";

interface DashboardSidebarProps {
  role: "user" | "lembaga" | "admin";
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const userMenuItems = [
    {
      label: "Profil Saya",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "CV Saya",
      href: "/dashboard/cv",
      icon: FileText,
    },
    {
      label: "Lamaran Saya",
      href: "/dashboard/applications",
      icon: Briefcase,
    },
    {
      label: "Kelas Saya",
      href: "/dashboard/classes",
      icon: GraduationCap,
    },
  ];

  const lembagaMenuItems = [
    {
      label: "Profil Organisasi",
      href: "/dashboard/org",
      icon: Building2,
    },
    {
      label: "Dokumen Legal",
      href: "/dashboard/legal",
      icon: FileText,
    },
    {
      label: "Lowongan Saya",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      label: "Posting Lowongan",
      href: "/dashboard/jobs/new",
      icon: Upload,
    },
    {
      label: "Pelamar",
      href: "/dashboard/applicants",
      icon: Users,
    },
  ];

  const adminMenuItems = [
    {
      label: "Overview",
      href: "/dashboard/admin/overview",
      icon: BarChart3,
    },
    {
      label: "Verifikasi Organisasi",
      href: "/dashboard/admin/verify-org",
      icon: CheckCircle,
    },
    {
      label: "Kelola Lowongan",
      href: "/dashboard/admin/jobs",
      icon: List,
    },
    {
      label: "Kelola Pengguna",
      href: "/dashboard/admin/users",
      icon: UserCheck,
    },
    {
      label: "Kelola Kelas",
      href: "/dashboard/admin/classes",
      icon: GraduationCap,
    },
    {
      label: "Pengaturan",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ];

  // Select menu items based on role
  let menuItems = userMenuItems;
  if (role === "lembaga") {
    menuItems = lembagaMenuItems;
  } else if (role === "admin") {
    menuItems = adminMenuItems;
  }

  const getRoleLabel = () => {
    switch (role) {
      case "user":
        return "Dashboard Pencari Kerja";
      case "lembaga":
        return "Dashboard Organisasi";
      case "admin":
        return "Dashboard Admin";
      default:
        return "Dashboard";
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md";
      case "lembaga":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md";
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md";
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-br from-white to-purple-50 border-r border-purple-200 min-h-screen sticky top-16">
      <div className="p-6">
        <div className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-purple-200">
          <h2 className="text-xl font-black text-gray-900 mb-2">{getRoleLabel()}</h2>
          <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-bold", getRoleBadgeColor())}>
            {role === "admin" && <Shield className="h-4 w-4 mr-1" />}
            {role === "lembaga" && <Building2 className="h-4 w-4 mr-1" />}
            {role === "user" && <User className="h-4 w-4 mr-1" />}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-800 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md hover:scale-102"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
