"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, FolderClosed } from "lucide-react";

type JobSearchBarProps = {
  initialSearch?: string;
  initialLocation?: string;
  initialCategory?: string;
};

const CATEGORY_ALL_VALUE = "__ALL__";

const CATEGORY_OPTIONS = [
  { value: CATEGORY_ALL_VALUE, label: "Semua Kategori" },
  { value: "dalam-negeri", label: "Dalam Negeri" },
  { value: "jepang", label: "Di Jepang" },
  { value: "ex-jepang", label: "Ex-Jepang" },
];

export function JobSearchBar({
  initialSearch = "",
  initialLocation = "",
  initialCategory = "",
}: JobSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const initialCategoryValue =
    initialCategory &&
    CATEGORY_OPTIONS.some((option) => option.value === initialCategory)
      ? initialCategory
      : CATEGORY_ALL_VALUE;
  const [category, setCategory] = useState(initialCategoryValue);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      keyword?.trim() ||
        location?.trim() ||
        (category && category !== CATEGORY_ALL_VALUE)
    );
  }, [keyword, location, category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    } else {
      params.delete("search");
    }

    if (location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    if (category && category !== CATEGORY_ALL_VALUE) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");
    const nextQuery = params.toString();
    router.push(nextQuery ? `/jobs?${nextQuery}` : "/jobs");
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["search", "location", "category", "page"].forEach((key) =>
      params.delete(key)
    );

    setKeyword("");
    setLocation("");
    setCategory(CATEGORY_ALL_VALUE);
    const nextQuery = params.toString();
    router.push(nextQuery ? `/jobs?${nextQuery}` : "/jobs");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur"
    >
      <div className="grid gap-3 lg:grid-cols-[2fr,1.3fr,1.3fr,auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Job title atau kata kunci"
            className="h-12 rounded-full border border-transparent bg-slate-50 pl-12 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60"
          />
        </div>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Semua kota"
            className="h-12 rounded-full border border-transparent bg-slate-50 pl-12 text-sm font-medium text-slate-700 transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60"
          />
        </div>

        <div className="relative">
          <FolderClosed className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-full border border-transparent bg-slate-50 pl-12 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#ff6154]/60">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-100 shadow-xl">
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="h-12 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ff5555] px-6 text-sm font-semibold shadow-lg transition hover:from-[#ff5555] hover:to-[#ff7a45] hover:shadow-xl"
        >
          Cari
        </Button>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasActiveFilters}
          className="text-sm font-semibold text-[#ff6154] transition hover:text-[#ff4438] disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
