"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicantStatusUpdaterProps {
  applicationId: string;
  currentStatus: string;
}

export function ApplicantStatusUpdater({ 
  applicationId, 
  currentStatus 
}: ApplicantStatusUpdaterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (value: string) => {
    setIsUpdating(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from("applications")
        .update({ 
          status: value,
          updated_at: new Date().toISOString() 
        })
        .eq("id", applicationId);

      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'applied': return 'text-blue-700';
      case 'shortlisted': return 'text-purple-700';
      case 'interview': return 'text-orange-700';
      case 'rejected': return 'text-red-700';
      case 'hired': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className={`h-9 border-2 font-bold ${getStatusColor(currentStatus)} ${isUpdating ? 'opacity-50' : ''}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-2 border-purple-300">
        <SelectItem value="applied" className="font-bold text-blue-700">
          📝 Baru
        </SelectItem>
        <SelectItem value="shortlisted" className="font-bold text-purple-700">
          ⭐ Shortlist
        </SelectItem>
        <SelectItem value="interview" className="font-bold text-orange-700">
          🎯 Interview
        </SelectItem>
        <SelectItem value="rejected" className="font-bold text-red-700">
          ❌ Ditolak
        </SelectItem>
        <SelectItem value="hired" className="font-bold text-green-700">
          ✅ Diterima
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
