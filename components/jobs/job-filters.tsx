"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Filter, MapPin, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type JobFiltersProps = {
  layout?: "dialog" | "sidebar";
};

const CATEGORY_OPTIONS = [
  { value: "__ALL__", label: "Semua kategori" },
  { value: "dalam-negeri", label: "Dalam Negeri" },
  { value: "jepang", label: "Di Jepang" },
  { value: "ex-jepang", label: "Ex-Jepang" },
];

const JLPT_OPTIONS = [
  { value: "__ALL__", label: "Semua level" },
  { value: "N5", label: "N5 (Pemula)" },
  { value: "N4", label: "N4 (Dasar)" },
  { value: "N3", label: "N3 (Menengah)" },
  { value: "N2", label: "N2 (Mahir)" },
  { value: "N1", label: "N1 (Profesional)" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "__ALL__", label: "Semua jenis" },
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "intern", label: "Internship" },
  { value: "contract", label: "Contract" },
];

export function JobFilters({ layout = "dialog" }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  const currentCategory = searchParams.get("category") ?? "__ALL__";
  const currentJlpt = searchParams.get("jlpt") ?? "__ALL__";
  const currentEmployment = searchParams.get("employment") ?? "__ALL__";

  const hasActiveFilters = useMemo(() => {
    return (
      (search?.trim() ?? "") !== "" ||
      (location?.trim() ?? "") !== "" ||
      currentCategory !== "__ALL__" ||
      currentJlpt !== "__ALL__" ||
      currentEmployment !== "__ALL__"
    );
  }, [search, location, currentCategory, currentJlpt, currentEmployment]);

  const pushParams = (params: URLSearchParams) => {
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    pushParams(params);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "__ALL__") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    pushParams(params);
  };

  const clearAll = () => {
    setSearch("");
    setLocation("");
    router.push("/jobs");
  };

  return (
    <div
      className={cn(
        "space-y-6",
        layout === "sidebar" &&
          "rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/40"
      )}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ffe8d9] to-[#ffe0dc] p-4">
        <Filter className="h-5 w-5 text-[#ff6154]" />
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Filter lanjutan
          </h3>
          <p className="text-sm text-slate-500">
            Sesuaikan preferensi untuk hasil yang lebih relevan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 rounded-2xl bg-white p-5 shadow-inner shadow-slate-200/60">
        <div className="space-y-2">
          <Label htmlFor="filter-search" className="text-sm font-semibold text-slate-700">
            Kata kunci
          </Label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="filter-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Contoh: Engineer, Designer"
              className="h-11 rounded-xl border-slate-200 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-location" className="text-sm font-semibold text-slate-700">
            Lokasi
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="filter-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Masukan kota atau prefektur"
              className="h-11 rounded-xl border-slate-200 pl-9 text-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-[#ff6154] font-semibold shadow-md shadow-[#ff6154]/30 hover:bg-[#ff4b3b]"
        >
          Terapkan
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <FilterGroup
          title="Kategori"
          value={currentCategory}
          onChange={(value) => updateFilter("category", value)}
          options={CATEGORY_OPTIONS}
        />
        <FilterGroup
          title="Level JLPT"
          value={currentJlpt}
          onChange={(value) => updateFilter("jlpt", value)}
          options={JLPT_OPTIONS}
        />
        <FilterGroup
          title="Jenis pekerjaan"
          value={currentEmployment}
          onChange={(value) => updateFilter("employment", value)}
          options={EMPLOYMENT_OPTIONS}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={clearAll}
        disabled={!hasActiveFilters}
        className="w-full rounded-xl border-2 border-[#ffb6a8] text-[#ff6154] hover:bg-[#fff1ed] hover:text-[#ff4b3b] disabled:border-slate-200 disabled:text-slate-400"
      >
        Reset semua filter
      </Button>
    </div>
  );
}

type FilterGroupProps = {
  title: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

function FilterGroup({ title, value, options, onChange }: FilterGroupProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">{title}</h4>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-2"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 text-sm font-medium text-slate-600 transition hover:border-[#ffd7cc] hover:bg-[#fff3ef]",
              value === option.value && "border-[#ffb6a8] bg-[#fff3ef] text-slate-800"
            )}
          >
            <RadioGroupItem
              value={option.value}
              className="border-[#ff9583] text-[#ff6154]"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

