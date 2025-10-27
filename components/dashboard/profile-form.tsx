"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Globe,
  Loader2,
  Check,
  X
} from "lucide-react";

interface ProfileFormProps {
  profile: {
    id: string;
    full_name: string;
    [key: string]: unknown;
  };
  userEmail?: string | null;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    socials: {
      linkedin: profile?.socials?.linkedin || "",
      facebook: profile?.socials?.facebook || "",
      twitter: profile?.socials?.twitter || "",
      instagram: profile?.socials?.instagram || "",
      website: profile?.socials?.website || "",
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          socials: formData.socials,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
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
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <h3 className="font-semibold text-xl text-slate-900">Informasi Dasar</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail || ""}
              disabled
              className="bg-slate-100 border-slate-300 text-slate-600 cursor-not-allowed"
            />
            <p className="text-sm text-slate-500">Email tidak dapat diubah</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-slate-700 font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="Masukkan nama lengkap"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 font-medium">
            Nomor Telepon
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+62 812-3456-7890"
            className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-slate-700 font-medium">
            Bio / Tentang Saya
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Ceritakan tentang diri Anda, pengalaman, dan keahlian..."
            rows={4}
            className="resize-none border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
          />
          <p className="text-sm text-slate-600 mt-2">
            📊 {formData.bio.length}/500 karakter
          </p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#ff6154] to-[#ff7a45] flex items-center justify-center">
            <span className="text-lg">🔗</span>
          </div>
          <h3 className="font-semibold text-xl text-slate-900">Media Sosial</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Label htmlFor="linkedin" className="flex items-center gap-2 text-slate-900 font-medium mb-2">
              <Linkedin className="h-5 w-5 text-[#2B3E7C]" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.socials.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/in/username"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Label htmlFor="facebook" className="flex items-center gap-2 text-slate-900 font-medium mb-2">
              <Facebook className="h-5 w-5 text-[#2B3E7C]" />
              Facebook
            </Label>
            <Input
              id="facebook"
              type="url"
              value={formData.socials.facebook}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/username"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Label htmlFor="twitter" className="flex items-center gap-2 text-slate-900 font-medium mb-2">
              <Twitter className="h-5 w-5 text-[#2B3E7C]" />
              Twitter
            </Label>
            <Input
              id="twitter"
              type="url"
              value={formData.socials.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/username"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Label htmlFor="instagram" className="flex items-center gap-2 text-slate-900 font-medium mb-2">
              <Instagram className="h-5 w-5 text-[#2B3E7C]" />
              Instagram
            </Label>
            <Input
              id="instagram"
              type="url"
              value={formData.socials.instagram}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/username"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 sm:col-span-2">
            <Label htmlFor="website" className="flex items-center gap-2 text-slate-900 font-medium mb-2">
              <Globe className="h-5 w-5 text-[#2B3E7C]" />
              Website / Portfolio
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.socials.website}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, website: e.target.value }
              })}
              placeholder="https://yourwebsite.com"
              className="border-slate-300 focus:border-[#2B3E7C] focus:ring-2 focus:ring-[#2B3E7C]/20 text-slate-800 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-lg ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 border-2 border-green-300' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-900 border-2 border-red-300'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span className="text-base font-bold">{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] hover:from-[#4B5E9C] hover:to-[#2B3E7C] text-white font-medium px-8 py-2.5 shadow-sm hover:shadow-md transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
