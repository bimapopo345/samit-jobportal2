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
  profile: any;
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
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <h3 className="font-bold text-xl text-gray-900">Informasi Dasar</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label htmlFor="email" className="text-gray-900 font-semibold mb-2 block">
              📧 Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail || ""}
              disabled
              className="bg-gray-100 border-gray-300 text-gray-900 font-bold disabled:opacity-100"
            />
            <p className="text-sm text-gray-700 mt-2 font-bold">🔒 Email tidak dapat diubah</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <Label htmlFor="full_name" className="text-gray-900 font-semibold mb-2 block">
              ✨ Nama Lengkap *
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="John Doe"
              className="border-purple-300 focus:border-purple-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <Label htmlFor="phone" className="text-gray-900 font-semibold mb-2 block">
            📱 Nomor Telepon
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+62 812-3456-7890"
            className="border-green-300 focus:border-green-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <Label htmlFor="bio" className="text-gray-900 font-semibold mb-2 block">
            📝 Bio / Tentang Saya
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Ceritakan tentang diri Anda, pengalaman, dan keahlian..."
            rows={4}
            className="resize-none border-blue-300 focus:border-blue-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
          />
          <p className="text-sm text-blue-700 mt-2 font-semibold">
            📊 {formData.bio.length}/500 karakter
          </p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="space-y-4 border-t-2 border-gray-100 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-lg">🔗</span>
          </div>
          <h3 className="font-bold text-xl text-gray-900">Media Sosial</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="linkedin" className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
              <Linkedin className="h-5 w-5 text-blue-600" />
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
              className="border-blue-300 focus:border-blue-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
            />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
            <Label htmlFor="facebook" className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
              <Facebook className="h-5 w-5 text-blue-700" />
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
              className="border-indigo-300 focus:border-indigo-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
            />
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
            <Label htmlFor="twitter" className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
              <Twitter className="h-5 w-5 text-sky-500" />
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
              className="border-cyan-300 focus:border-cyan-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
            />
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-4 rounded-lg border border-rose-200">
            <Label htmlFor="instagram" className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
              <Instagram className="h-5 w-5 text-pink-600" />
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
              className="border-rose-300 focus:border-rose-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
            />
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-violet-200 sm:col-span-2">
            <Label htmlFor="website" className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
              <Globe className="h-5 w-5 text-purple-600" />
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
              className="border-violet-300 focus:border-violet-500 font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold"
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
          className="bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary text-white font-bold px-8 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
