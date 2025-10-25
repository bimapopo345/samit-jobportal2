"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Upload,
  Trash2,
  Star,
  StarOff,
  Download,
  Loader2,
  Check,
  X,
  FileUp,
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  file_url: string;
  file_size: number;
  is_default: boolean;
  uploaded_at: string;
}

interface CVManagerProps {
  initialResumes: Resume[];
  userId: string;
  defaultCvId?: string;
}

export function CVManager({ initialResumes, userId, defaultCvId }: CVManagerProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Hanya file PDF atau Word yang diperbolehkan' });
      return;
    }

    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      // Upload to storage
      const fileName = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Save to database
      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_default: resumes.length === 0, // Set as default if first CV
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update state
      setResumes([resumeData, ...resumes]);
      setMessage({ type: 'success', text: 'CV berhasil diunggah!' });
      router.refresh();

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Gagal mengunggah CV' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (!confirm(`Hapus CV "${resume.title}"?`)) return;

    setLoading(resume.id);
    const supabase = createClient();

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (dbError) throw dbError;

      // Delete from storage
      const fileName = resume.file_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('resumes')
          .remove([`${userId}/${fileName}`]);
      }

      // Update state
      setResumes(resumes.filter(r => r.id !== resume.id));
      setMessage({ type: 'success', text: 'CV berhasil dihapus' });
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Gagal menghapus CV' 
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSetDefault = async (resume: Resume) => {
    setLoading(resume.id);
    const supabase = createClient();

    try {
      // Reset all to non-default
      await supabase
        .from('resumes')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set selected as default
      const { error } = await supabase
        .from('resumes')
        .update({ is_default: true })
        .eq('id', resume.id);

      if (error) throw error;

      // Update profile's default_cv_id
      await supabase
        .from('profiles')
        .update({ default_cv_id: resume.id })
        .eq('id', userId);

      // Update state
      setResumes(resumes.map(r => ({
        ...r,
        is_default: r.id === resume.id
      })));
      
      setMessage({ type: 'success', text: 'CV default berhasil diubah' });
      router.refresh();
    } catch (error) {
      console.error('Set default error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Gagal mengubah CV default' 
      });
    } finally {
      setLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] h-1" />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload CV Baru</h3>
          <p className="text-slate-600 mb-6">
            Format yang diterima: PDF, DOC, DOCX (Maksimal 5MB)
          </p>
          
          <div className="space-y-4">
            <Label htmlFor="cv-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-10 text-center hover:border-[#2B3E7C] hover:bg-slate-100 transition-all">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#2B3E7C] to-[#4B5E9C] flex items-center justify-center">
                  <FileUp className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-2">
                  Klik untuk pilih file atau drag & drop
                </p>
                <p className="text-sm text-slate-600">
                  PDF, DOC, DOCX hingga 5MB
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">📄 PDF</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">📝 DOC</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">📋 DOCX</span>
                </div>
              </div>
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </Label>

            {uploading && (
              <div className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Loader2 className="h-5 w-5 animate-spin text-[#2B3E7C]" />
                <span className="font-medium text-slate-900">Mengunggah CV...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.type === 'success' ? (
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* CV List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2B3E7C] to-[#4B5E9C] h-1" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">CV Tersimpan</h3>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
              {resumes.length} CV tersimpan
            </span>
          </div>
          
          {resumes.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-white to-blue-50 rounded-xl">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-800 font-bold text-lg mb-2">Belum ada CV yang diunggah</p>
              <p className="text-gray-700 font-semibold">
                Upload CV pertama Anda untuk mulai melamar pekerjaan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900 text-lg">{resume.title}</p>
                        {resume.is_default && (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow">
                            ⭐ Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        📦 {formatFileSize(resume.file_size)} • 📅 Diunggah {formatDate(resume.uploaded_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Download Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 transition-all"
                    >
                      <a href={resume.file_url} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold">
                        <Download className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700 hidden sm:inline">Download</span>
                      </a>
                    </Button>

                    {/* Set Default Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(resume)}
                      disabled={loading === resume.id || resume.is_default}
                      className={`border-2 transition-all ${
                        resume.is_default 
                          ? 'border-yellow-400 bg-gradient-to-r from-yellow-100 to-amber-100' 
                          : 'border-gray-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:border-yellow-400'
                      }`}
                    >
                      {loading === resume.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                      ) : resume.is_default ? (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-yellow-700 font-bold hidden sm:inline">Default</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <StarOff className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 font-semibold hidden sm:inline">Set Default</span>
                        </div>
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(resume)}
                      disabled={loading === resume.id}
                      className="border-2 border-red-300 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:border-red-400 transition-all"
                    >
                      {loading === resume.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 font-bold hidden sm:inline">Hapus</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
