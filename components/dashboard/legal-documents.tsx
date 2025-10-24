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
  Check,
  X,
  Loader2,
  Download,
  Eye,
  Shield,
  Building,
  Users,
  Award,
  FileCheck,
} from "lucide-react";

interface LegalDocumentsProps {
  organizationId: string;
  currentDocuments: any;
  verificationStatus: string;
}

const documentTypes = [
  {
    id: 'siup',
    name: 'SIUP',
    description: 'Surat Izin Usaha Perdagangan',
    icon: Building,
    color: 'blue',
    required: true,
  },
  {
    id: 'nib',
    name: 'NIB',
    description: 'Nomor Induk Berusaha',
    icon: Shield,
    color: 'green',
    required: true,
  },
  {
    id: 'npwp',
    name: 'NPWP',
    description: 'Nomor Pokok Wajib Pajak',
    icon: FileCheck,
    color: 'purple',
    required: true,
  },
  {
    id: 'akta',
    name: 'Akta Perusahaan',
    description: 'Akta Pendirian atau Perubahan',
    icon: Award,
    color: 'orange',
    required: false,
  },
  {
    id: 'domisili',
    name: 'Surat Domisili',
    description: 'Surat Keterangan Domisili Usaha',
    icon: Users,
    color: 'pink',
    required: false,
  },
];

export function LegalDocuments({ organizationId, currentDocuments, verificationStatus }: LegalDocumentsProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [documents, setDocuments] = useState(currentDocuments);

  const handleFileUpload = async (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Hanya file PDF, JPG, atau PNG yang diperbolehkan' });
      return;
    }

    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 10MB' });
      return;
    }

    setUploading(docType);
    setMessage(null);

    const supabase = createClient();

    try {
      // Upload to storage
      const fileName = `${organizationId}/${docType}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('legal-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('legal-documents')
        .getPublicUrl(fileName);

      // Update organization's legal_documents
      const updatedDocs = {
        ...documents,
        [docType]: {
          url: publicUrl,
          filename: file.name,
          uploaded_at: new Date().toISOString(),
        }
      };

      const { error: dbError } = await supabase
        .from('organizations')
        .update({
          legal_documents: updatedDocs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organizationId);

      if (dbError) throw dbError;

      setDocuments(updatedDocs);
      setMessage({ type: 'success', text: `${docType.toUpperCase()} berhasil diunggah!` });
      router.refresh();

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Gagal mengunggah dokumen' 
      });
    } finally {
      setUploading(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300',
      green: 'from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
      purple: 'from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300',
      orange: 'from-orange-50 to-yellow-50 border-orange-200 hover:border-orange-300',
      pink: 'from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300',
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'from-blue-500 to-indigo-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-yellow-500',
      pink: 'from-pink-500 to-rose-500',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Document Requirements Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="font-black text-xl text-gray-900 mb-2">Persyaratan Dokumen</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700 font-semibold">Format: PDF, JPG, atau PNG (Maks. 10MB)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700 font-semibold">Dokumen harus jelas dan terbaca</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700 font-semibold">Dokumen wajib: SIUP, NIB, NPWP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-5 rounded-xl flex items-center gap-4 shadow-lg ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 border-2 border-green-300' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-900 border-2 border-red-300'
        }`}>
          {message.type === 'success' ? (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <X className="h-6 w-6 text-white" />
            </div>
          )}
          <span className="text-base font-bold">{message.text}</span>
        </div>
      )}

      {/* Document Upload Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documentTypes.map((docType) => {
          const Icon = docType.icon;
          const doc = documents?.[docType.id];
          const isUploaded = !!doc;
          
          return (
            <div
              key={docType.id}
              className={`bg-gradient-to-br ${getColorClasses(docType.color)} rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getIconColorClasses(docType.color)} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{docType.name}</h4>
                    <p className="text-sm text-gray-700 font-semibold">{docType.description}</p>
                  </div>
                </div>
                {docType.required && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    Wajib
                  </span>
                )}
              </div>

              {/* Upload Status or Input */}
              {isUploaded ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white/80 rounded-lg border border-green-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-bold text-green-800">Sudah Diunggah</span>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold truncate">
                      📄 {doc.filename}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 border-2 font-bold"
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 border-2 font-bold"
                    >
                      <a href={doc.url} download>
                        <Download className="h-4 w-4 mr-1" />
                        Unduh
                      </a>
                    </Button>
                  </div>
                  
                  {/* Re-upload option */}
                  <Label htmlFor={`upload-${docType.id}`} className="cursor-pointer">
                    <div className="p-3 border-2 border-dashed border-gray-400 rounded-lg text-center hover:border-gray-600 transition-colors bg-white/50">
                      <p className="text-sm font-bold text-gray-700">
                        🔄 Upload Ulang
                      </p>
                    </div>
                    <Input
                      id={`upload-${docType.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(docType.id, e)}
                      disabled={uploading === docType.id}
                      className="hidden"
                    />
                  </Label>
                </div>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor={`upload-${docType.id}`} className="cursor-pointer">
                    <div className="p-6 border-3 border-dashed border-gray-400 rounded-xl text-center hover:border-gray-600 transition-all bg-white/50 hover:bg-white/70">
                      {uploading === docType.id ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                          <p className="text-sm font-bold text-gray-700">Mengunggah...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                          <p className="text-sm font-bold text-gray-900">Klik untuk upload</p>
                          <p className="text-xs text-gray-700 font-semibold mt-1">
                            PDF, JPG, PNG (Maks. 10MB)
                          </p>
                        </>
                      )}
                    </div>
                    <Input
                      id={`upload-${docType.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(docType.id, e)}
                      disabled={uploading === docType.id}
                      className="hidden"
                    />
                  </Label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit for Verification */}
      {verificationStatus === 'pending' && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-2">⏳ Dokumen Sedang Diverifikasi</h3>
            <p className="text-gray-700 font-semibold">
              Tim admin kami sedang memeriksa dokumen Anda. Proses ini biasanya memakan waktu 1-3 hari kerja.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'verified' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-2">✅ Organisasi Terverifikasi!</h3>
            <p className="text-gray-700 font-semibold">
              Selamat! Organisasi Anda telah terverifikasi dan dapat memposting lowongan pekerjaan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
