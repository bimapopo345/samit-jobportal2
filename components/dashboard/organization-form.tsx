"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Loader2,
  Check,
  X
} from "lucide-react";

interface OrganizationFormProps {
  organization: any;
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    slug: organization.slug || "",
    display_name: organization.display_name || "",
    description: organization.description || "",
    email: organization.email || "",
    phone: organization.phone || "",
    website: organization.website || "",
    address: organization.address || "",
    founded_year: organization.founded_year || "",
    employee_count: organization.employee_count || "",
    industry: organization.industry || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        throw new Error('Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung');
      }

      const { error } = await supabase
        .from("organizations")
        .update({
          slug: formData.slug,
          display_name: formData.display_name,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
          employee_count: formData.employee_count,
          industry: formData.industry,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organization.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profil organisasi berhasil diperbarui!' });
      router.refresh();
    } catch (error) {
      console.error("Error updating organization:", error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui profil' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information - COLORFUL */}
      <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-black text-xl text-gray-900">Informasi Dasar</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="display_name" className="font-bold text-gray-900 text-base mb-2 block">
              🏢 Nama Organisasi *
            </Label>
            <Input
              id="display_name"
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
              placeholder="PT. Example Indonesia"
              className="h-11 border-blue-300 focus:border-blue-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-blue-50/30"
            />
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg border border-indigo-200">
            <Label htmlFor="slug" className="font-bold text-gray-900 text-base mb-2 block">
              🔗 URL Slug *
            </Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              required
              placeholder="example-company"
              pattern="^[a-z0-9-]+$"
              className="h-11 border-indigo-300 focus:border-indigo-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-indigo-50/30"
            />
            <p className="text-sm font-bold text-indigo-700 mt-2">/companies/{formData.slug}</p>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
          <Label htmlFor="description" className="font-bold text-gray-900 text-base mb-2 block">
            📝 Deskripsi Organisasi
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ceritakan tentang organisasi Anda, visi, misi, dan keunggulan..."
            rows={4}
            className="resize-none border-purple-300 focus:border-purple-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-purple-50/30"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white/80 p-4 rounded-lg border border-green-200">
            <Label htmlFor="industry" className="font-bold text-gray-900 text-base mb-2 block">
              💼 Industri
            </Label>
            <Input
              id="industry"
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Teknologi, Manufaktur, dll"
              className="h-11 border-green-300 focus:border-green-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-green-50/30"
            />
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg border border-yellow-200">
            <Label htmlFor="employee_count" className="font-bold text-gray-900 text-base mb-2 block">
              👥 Jumlah Karyawan
            </Label>
            <Input
              id="employee_count"
              type="text"
              value={formData.employee_count}
              onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
              placeholder="1-10, 11-50, 51-200, dll"
              className="h-11 border-yellow-300 focus:border-yellow-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-yellow-50/30"
            />
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-lg border border-pink-200">
          <Label htmlFor="founded_year" className="font-bold text-gray-900 text-base mb-2 block">
            📅 Tahun Berdiri
          </Label>
          <Input
            id="founded_year"
            type="number"
            value={formData.founded_year}
            onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
            placeholder="2020"
            min="1900"
            max={new Date().getFullYear()}
            className="h-11 border-pink-300 focus:border-pink-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-pink-50/30"
          />
        </div>
      </div>

      {/* Contact Information - COLORFUL */}
      <div className="space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-black text-xl text-gray-900">Informasi Kontak</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="email" className="font-bold text-gray-900 text-base mb-2 block">
              📧 Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@example.com"
              className="h-11 border-blue-300 focus:border-blue-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-blue-50/30"
            />
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg border border-green-200">
            <Label htmlFor="phone" className="font-bold text-gray-900 text-base mb-2 block">
              📱 Telepon
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="021-1234567"
              className="h-11 border-green-300 focus:border-green-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-green-50/30"
            />
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
          <Label htmlFor="website" className="font-bold text-gray-900 text-base mb-2 block">
            🌐 Website
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
            className="h-11 border-purple-300 focus:border-purple-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-purple-50/30"
          />
        </div>

        <div className="bg-white/80 p-4 rounded-lg border border-orange-200">
          <Label htmlFor="address" className="font-bold text-gray-900 text-base mb-2 block">
            📍 Alamat
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta, Indonesia"
            rows={3}
            className="resize-none border-orange-300 focus:border-orange-500 font-semibold text-gray-800 placeholder:text-gray-700 placeholder:font-bold bg-orange-50/30"
          />
        </div>
      </div>

      {/* Message Display - COLORFUL */}
      {message && (
        <div className={`p-5 rounded-xl flex items-center gap-4 shadow-lg ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 border-2 border-green-300' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-900 border-2 border-red-300'
        }`}>
          {message.type === 'success' ? (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
              <X className="h-6 w-6 text-white" />
            </div>
          )}
          <span className="text-base font-bold">{message.text}</span>
        </div>
      )}

      {/* Submit Button - COLORFUL */}
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-base px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              💾 Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
