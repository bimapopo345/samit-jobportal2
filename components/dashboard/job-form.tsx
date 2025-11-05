"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2,
  Check,
  X,
  Plus,
  Tag
} from "lucide-react";

interface JobFormProps {
  organizationId: string;
  job?: {
    id: string;
    title: string;
    description: string;
    [key: string]: unknown;
  }; // For editing existing job
}

export function JobForm({ organizationId, job }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tagInput, setTagInput] = useState("");
  
  const [formData, setFormData] = useState({
    title: job?.title || "",
    slug: job?.slug || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    benefits: job?.benefits || "",
    employment_type: job?.employment_type || "fulltime",
    location_type: job?.location_type || "onsite",
    category: job?.category || "dalam-negeri",
    jlpt_required: job?.jlpt_required || "",
    is_gijinkoku: job?.is_gijinkoku || false,
    is_nihongo_gakkou: job?.is_nihongo_gakkou || false,
    is_intensive_class_partner: job?.is_intensive_class_partner || false,
    location_city: job?.location_city || "",
    location_prefecture: job?.location_prefecture || "",
    salary_min: job?.salary_min || "",
    salary_max: job?.salary_max || "",
    salary_currency: job?.salary_currency || "JPY",
    show_salary: job?.show_salary ?? true,
    tags: job?.tags || [],
    application_deadline: job?.application_deadline || "",
    start_date: job?.start_date || "",
    is_active: job?.is_active ?? true,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title) + '-' + Date.now();

      const jobData = {
        ...formData,
        org_id: organizationId,
        slug,
        salary_min: formData.salary_min ? parseInt(formData.salary_min.toString()) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max.toString()) : null,
        jlpt_required: formData.jlpt_required || null,
        application_deadline: formData.application_deadline || null,
        start_date: formData.start_date || null,
        published_at: job?.published_at || new Date().toISOString(),
      };

      let result;
      if (job) {
        // Update existing job
        result = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", job.id)
          .select()
          .single();
      } else {
        // Create new job
        result = await supabase
          .from("jobs")
          .insert(jobData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setMessage({ 
        type: 'success', 
        text: job ? 'Lowongan berhasil diperbarui!' : 'Lowongan berhasil dibuat!' 
      });
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard/jobs');
      }, 2000);
    } catch (error) {
      console.error("Error saving job:", error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Terjadi kesalahan' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Title and Slug */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Informasi Dasar</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Judul Lowongan *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
              required
              placeholder="Software Engineer, Marketing Manager, dll"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Jelaskan tentang posisi ini, tanggung jawab, dan apa yang akan dikerjakan..."
            rows={6}
          />
        </div>

        <div>
          <Label htmlFor="requirements">Persyaratan</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="- Minimal S1 Teknik Informatika&#10;- Pengalaman 3+ tahun&#10;- Menguasai React.js"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="benefits">Benefit & Fasilitas</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            placeholder="- Asuransi kesehatan&#10;- Bonus performa&#10;- Remote working"
            rows={4}
          />
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-lg">Detail Lowongan</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="employment_type">Tipe Pekerjaan *</Label>
            <Select
              value={formData.employment_type}
              onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location_type">Tipe Lokasi *</Label>
            <Select
              value={formData.location_type}
              onValueChange={(value) => setFormData({ ...formData, location_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dalam-negeri">Dalam Negeri</SelectItem>
                <SelectItem value="jepang">Di Jepang</SelectItem>
                <SelectItem value="ex-jepang">Ex-Jepang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="jlpt_required">Level JLPT</Label>
            <Select
              value={formData.jlpt_required}
              onValueChange={(value) => setFormData({ ...formData, jlpt_required: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih level JLPT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                <SelectItem value="N5">N5</SelectItem>
                <SelectItem value="N4">N4</SelectItem>
                <SelectItem value="N3">N3</SelectItem>
                <SelectItem value="N2">N2</SelectItem>
                <SelectItem value="N1">N1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Special Flags */}
        <div className="space-y-3">
          <Label>Flags Khusus</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_gijinkoku"
                checked={formData.is_gijinkoku}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_gijinkoku: checked as boolean })
                }
              />
              <Label htmlFor="is_gijinkoku" className="font-normal cursor-pointer">
                Gijinkoku (Izin tinggal khusus)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_nihongo_gakkou"
                checked={formData.is_nihongo_gakkou}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_nihongo_gakkou: checked as boolean })
                }
              />
              <Label htmlFor="is_nihongo_gakkou" className="font-normal cursor-pointer">
                Link dengan Nihongo Gakkou
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_intensive_class_partner"
                checked={formData.is_intensive_class_partner}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_intensive_class_partner: checked as boolean })
                }
              />
              <Label htmlFor="is_intensive_class_partner" className="font-normal cursor-pointer">
                Partner Kelas Intensif
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Salary */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-lg">Lokasi & Gaji</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="location_city">Kota</Label>
            <Input
              id="location_city"
              type="text"
              value={formData.location_city}
              onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
              placeholder="Jakarta, Tokyo, dll"
            />
          </div>

          <div>
            <Label htmlFor="location_prefecture">Provinsi/Prefektur</Label>
            <Input
              id="location_prefecture"
              type="text"
              value={formData.location_prefecture}
              onChange={(e) => setFormData({ ...formData, location_prefecture: e.target.value })}
              placeholder="DKI Jakarta, Tokyo-to, dll"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="salary_min">Gaji Minimal</Label>
            <Input
              id="salary_min"
              type="number"
              value={formData.salary_min}
              onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              placeholder="5000000"
            />
          </div>

          <div>
            <Label htmlFor="salary_max">Gaji Maksimal</Label>
            <Input
              id="salary_max"
              type="number"
              value={formData.salary_max}
              onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              placeholder="10000000"
            />
          </div>

          <div>
            <Label htmlFor="salary_currency">Mata Uang</Label>
            <Select
              value={formData.salary_currency}
              onValueChange={(value) => setFormData({ ...formData, salary_currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show_salary"
            checked={formData.show_salary}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, show_salary: checked as boolean })
            }
          />
          <Label htmlFor="show_salary" className="font-normal cursor-pointer">
            Tampilkan gaji di listing
          </Label>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-lg">Tags</h3>
        
        <div className="flex gap-2">
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Tambah tag..."
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-lg">Tanggal</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="application_deadline">Deadline Aplikasi</Label>
            <Input
              id="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="start_date">Tanggal Mulai Kerja</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, is_active: checked as boolean })
          }
        />
        <Label htmlFor="is_active" className="font-normal cursor-pointer">
          Aktif (Tampil di listing publik)
        </Label>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            job ? 'Perbarui Lowongan' : 'Posting Lowongan'
          )}
        </Button>
      </div>
    </form>
  );
}
