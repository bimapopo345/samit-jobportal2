"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
}

interface ApplicantsFilterProps {
  jobs: Job[] | null;
  currentJobId?: string;
}

export function ApplicantsFilter({ jobs, currentJobId }: ApplicantsFilterProps) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    if (value === "all") {
      router.push("/dashboard/applicants");
    } else {
      router.push(`/dashboard/applicants?job=${value}`);
    }
  };

  return (
    <Select
      value={currentJobId || "all"}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="h-12 border-2 border-purple-300 font-bold text-gray-800 bg-gradient-to-r from-purple-50 to-pink-50">
        <SelectValue placeholder="Pilih lowongan" />
      </SelectTrigger>
      <SelectContent className="border-2 border-purple-300">
        <SelectItem value="all" className="font-bold">
          🌟 Semua Lowongan
        </SelectItem>
        {jobs?.map((job) => (
          <SelectItem key={job.id} value={job.id} className="font-semibold">
            💼 {job.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
