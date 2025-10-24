"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Briefcase, GraduationCap, Building2 } from "lucide-react";
import { useState } from "react";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 when filtering
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/jobs");
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 sticky top-20">
      <div className="flex items-center gap-2 mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="font-black text-lg text-gray-900">Filter Pencarian</h2>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="search" className="font-bold text-gray-900 text-base mb-2 block">
            🔍 Cari Posisi
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-blue-500" />
            <Input
              id="search"
              type="text"
              placeholder="Kata kunci..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 border-blue-200 focus:border-blue-400 font-semibold text-gray-800 placeholder:font-normal"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location" className="font-bold text-gray-900 text-base mb-2 block">
            <MapPin className="inline h-4 w-4 text-blue-500 mr-1" />
            Lokasi
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Kota atau prefektur..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 border-blue-200 focus:border-blue-400 font-semibold text-gray-800 placeholder:font-normal"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Search className="mr-2 h-4 w-4" />
          Cari Sekarang
        </Button>
      </form>

      {/* Category Filter */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
        <Label className="mb-3 block font-bold text-gray-900 text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-600" />
          Kategori
        </Label>
        <RadioGroup 
          value={searchParams.get("category") || ""} 
          onValueChange={(value) => updateFilter("category", value)}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="" id="all-categories" className="border-purple-400 text-purple-600" />
              <Label htmlFor="all-categories" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                ✨ Semua Kategori
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="dalam-negeri" id="dalam-negeri" className="border-blue-400 text-blue-600" />
              <Label htmlFor="dalam-negeri" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🏢 Dalam Negeri
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="jepang" id="jepang" className="border-red-400 text-red-600" />
              <Label htmlFor="jepang" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🇯🇵 Di Jepang
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="ex-jepang" id="ex-jepang" className="border-green-400 text-green-600" />
              <Label htmlFor="ex-jepang" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🌟 Ex-Jepang
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* JLPT Filter */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
        <Label className="mb-3 block font-bold text-gray-900 text-base flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-green-600" />
          Level JLPT
        </Label>
        <RadioGroup 
          value={searchParams.get("jlpt") || ""} 
          onValueChange={(value) => updateFilter("jlpt", value)}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="" id="all-jlpt" className="border-green-400 text-green-600" />
              <Label htmlFor="all-jlpt" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🌐 Semua Level
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="N5" id="n5" className="border-green-400 text-green-600" />
              <Label htmlFor="n5" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📗 N5 (Pemula)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="N4" id="n4" className="border-green-400 text-green-600" />
              <Label htmlFor="n4" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📘 N4 (Dasar)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="N3" id="n3" className="border-green-400 text-green-600" />
              <Label htmlFor="n3" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📙 N3 (Menengah)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="N2" id="n2" className="border-green-400 text-green-600" />
              <Label htmlFor="n2" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📕 N2 (Mahir)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="N1" id="n1" className="border-green-400 text-green-600" />
              <Label htmlFor="n1" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📓 N1 (Profesional)
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Employment Type Filter */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
        <Label className="mb-3 block font-bold text-gray-900 text-base flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-orange-600" />
          Jenis Pekerjaan
        </Label>
        <RadioGroup 
          value={searchParams.get("employment") || ""} 
          onValueChange={(value) => updateFilter("employment", value)}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="" id="all-employment" className="border-orange-400 text-orange-600" />
              <Label htmlFor="all-employment" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🎯 Semua Jenis
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="fulltime" id="fulltime" className="border-orange-400 text-orange-600" />
              <Label htmlFor="fulltime" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                💼 Full Time
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="parttime" id="parttime" className="border-orange-400 text-orange-600" />
              <Label htmlFor="parttime" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                ⏰ Part Time
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="intern" id="intern" className="border-orange-400 text-orange-600" />
              <Label htmlFor="intern" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                🎓 Internship
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RadioGroupItem value="contract" id="contract" className="border-orange-400 text-orange-600" />
              <Label htmlFor="contract" className="font-bold text-gray-800 cursor-pointer text-[15px]">
                📋 Contract
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 font-bold text-base shadow-md hover:shadow-lg transition-all" 
        onClick={clearFilters}
      >
        🔄 Hapus Semua Filter
      </Button>
    </div>
  );
}
