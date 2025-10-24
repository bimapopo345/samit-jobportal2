"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Upload,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Input } from "./ui/input";

interface ApplicationFormProps {
  job: any;
  resumes: any[];
  userId: string;
}

export function ApplicationForm({ job, resumes, userId }: ApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  
  const [formData, setFormData] = useState({
    selectedCvId: resumes.find(r => r.is_default)?.id || resumes[0]?.id || '',
    coverLetter: '',
    cvFile: null as File | null,
  });

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData({ ...formData, cvFile: file, selectedCvId: 'new' });
    setMessage({ type: 'success', text: `File "${file.name}" siap diunggah` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      let cvUrl = '';

      // If uploading new CV
      if (formData.selectedCvId === 'new' && formData.cvFile) {
        setUploadingCV(true);
        
        // Upload to storage
        const fileName = `${userId}/${Date.now()}_${formData.cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.cvFile);

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
            title: formData.cvFile.name,
            file_url: publicUrl,
            file_size: formData.cvFile.size,
            is_default: resumes.length === 0,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        cvUrl = publicUrl;
        setUploadingCV(false);
      } else {
        // Use selected existing CV
        const selectedResume = resumes.find(r => r.id === formData.selectedCvId);
        if (!selectedResume) {
          throw new Error('Silakan pilih CV atau unggah CV baru');
        }
        cvUrl = selectedResume.file_url;
      }

      // Create application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          applicant_id: userId,
          cv_url: cvUrl,
          cover_letter: formData.coverLetter,
          status: 'applied',
        });

      if (applicationError) throw applicationError;

      // Update job applications count
      await supabase
        .from('jobs')
        .update({ 
          applications_count: (job.applications_count || 0) + 1 
        })
        .eq('id', job.id);

      // Success
      setMessage({ 
        type: 'success', 
        text: 'Lamaran berhasil dikirim! Anda akan dihubungi jika lolos seleksi.' 
      });

      // Redirect after delay
      setTimeout(() => {
        router.push('/dashboard/applications');
      }, 3000);

    } catch (error) {
      console.error('Application error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Gagal mengirim lamaran' 
      });
    } finally {
      setLoading(false);
      setUploadingCV(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CV Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih CV</CardTitle>
          <CardDescription>
            Pilih CV yang sudah ada atau unggah CV baru
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumes.length > 0 ? (
            <RadioGroup
              value={formData.selectedCvId}
              onValueChange={(value) => setFormData({ ...formData, selectedCvId: value })}
            >
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={resume.id} id={resume.id} />
                  <Label htmlFor={resume.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-brand-primary" />
                      <div>
                        <p className="font-medium">{resume.title}</p>
                        <p className="text-sm text-gray-500">
                          Diunggah {new Date(resume.uploaded_at).toLocaleDateString('id-ID')}
                          {resume.is_default && (
                            <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
              
              {/* Upload new option */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="new" id="new-cv" />
                <Label htmlFor="new-cv" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Unggah CV Baru</p>
                      <p className="text-sm text-gray-500">PDF atau Word, maksimal 5MB</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Anda belum memiliki CV tersimpan. Silakan unggah CV baru.
              </p>
              <input
                type="hidden"
                value="new"
                onChange={() => setFormData({ ...formData, selectedCvId: 'new' })}
              />
            </div>
          )}

          {/* File upload input (shown when "new" is selected) */}
          {(formData.selectedCvId === 'new' || resumes.length === 0) && (
            <div className="mt-4">
              <Label htmlFor="cv-upload">Upload CV *</Label>
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                required={formData.selectedCvId === 'new' || resumes.length === 0}
                className="mt-1"
              />
              {formData.cvFile && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {formData.cvFile.name} siap diunggah
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle>Surat Lamaran</CardTitle>
          <CardDescription>
            Jelaskan mengapa Anda cocok untuk posisi ini (opsional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            placeholder="Kepada Yth. HRD,

Saya tertarik dengan posisi ini karena...

Saya memiliki pengalaman...

Terima kasih atas perhatiannya."
            rows={8}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={loading || (!formData.selectedCvId && !formData.cvFile)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingCV ? 'Mengunggah CV...' : 'Mengirim Lamaran...'}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Kirim Lamaran
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
