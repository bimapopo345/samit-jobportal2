import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MapPin, Building2, GraduationCap, Users, Globe, BookOpen, Sparkles, Star, Zap, ArrowRight, TrendingUp, Award } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero Section - VIBRANT GRADIENT */}
        <section className="relative bg-gradient-to-br from-brand-primary via-purple-800 to-indigo-900 py-24 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-accent/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="h-5 w-5 text-brand-accent animate-pulse" />
                <span className="text-sm font-bold text-white">Platform Karir Indonesia-Jepang #1</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Wujudkan Karir Impianmu di{" "}
                <span className="bg-gradient-to-r from-brand-accent via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Jepang
                </span>
              </h1>
              <p className="text-2xl text-gray-100 mb-10 max-w-3xl mx-auto">
                Portal lowongan kerja khusus Jepang dengan dukungan pembelajaran bahasa terlengkap
              </p>
            </div>

            {/* Search Box - GLASSMORPHISM EFFECT */}
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
              <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-purple-500" />
                  <Input 
                    type="text" 
                    placeholder="Cari posisi atau perusahaan..." 
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500 font-medium"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-purple-500" />
                  <Input 
                    type="text" 
                    placeholder="Lokasi (Tokyo, Osaka, dll)" 
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500 font-medium"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-gradient-to-r from-brand-primary to-purple-700 hover:from-purple-700 hover:to-brand-primary text-white font-bold px-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Cari Lowongan
                </Button>
              </form>
              
              {/* Quick Filters - COLORFUL BADGES */}
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <span className="text-sm font-semibold text-gray-700">Populer:</span>
                <Link href="/jobs?category=jepang" className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full font-semibold hover:shadow-md transition-all hover:scale-105">
                  🇯🇵 Di Jepang
                </Link>
                <Link href="/jobs?jlpt=N3" className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-semibold hover:shadow-md transition-all hover:scale-105">
                  📚 JLPT N3
                </Link>
                <Link href="/jobs?type=fulltime" className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold hover:shadow-md transition-all hover:scale-105">
                  💼 Full Time
                </Link>
                <Link href="/jobs?flag=gijinkoku" className="px-4 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full font-semibold hover:shadow-md transition-all hover:scale-105">
                  ⭐ Gijinkou
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - COLORFUL GRADIENT CARDS */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
          <div className="container mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-700" />
                <span className="text-sm font-bold text-purple-700">3 Kategori Utama</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Pilih Jalur Karir{" "}
                <span className="bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
                  Impianmu
                </span>
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Temukan peluang karir yang sesuai dengan pengalaman dan tujuanmu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Dalam Negeri Card */}
              <Link href="/jobs?category=dalam-negeri" className="group">
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-500" />
                  <div className="p-8">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">
                      Dalam Negeri
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Lowongan kerja di perusahaan Jepang yang beroperasi di Indonesia
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      Lihat Lowongan
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Di Jepang Card */}
              <Link href="/jobs?category=jepang" className="group">
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-pink-500" />
                  <div className="p-8">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">
                      Di Jepang
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Kesempatan berkarir langsung di Jepang dengan sponsor visa
                    </p>
                    <div className="flex items-center text-red-600 font-semibold">
                      Lihat Lowongan
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-6xl opacity-10">🇯🇵</div>
                </div>
              </Link>
              
              {/* Ex-Jepang Card */}
              <Link href="/jobs?category=ex-jepang" className="group">
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-500" />
                  <div className="p-8">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">
                      Ex-Jepang
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Khusus untuk yang pernah bekerja atau magang di Jepang
                    </p>
                    <div className="flex items-center text-purple-600 font-semibold">
                      Lihat Lowongan
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Classes Section - GRADIENT CARDS */}
        <section className="py-20 px-4 bg-gradient-to-br from-white via-brand-accent/5 to-pink-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                <GraduationCap className="h-5 w-5 text-emerald-700" />
                <span className="text-sm font-bold text-emerald-700">Tingkatkan Skill Bahasa</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Master Bahasa Jepang dengan{" "}
                <span className="bg-gradient-to-r from-brand-accent to-pink-500 bg-clip-text text-transparent">
                  Metode Terbaik
                </span>
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Persiapkan diri dengan kelas-kelas berkualitas dari instruktur berpengalaman
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Kaiwa Card */}
              <Link href="/classes?type=kaiwa" className="group">
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">💬</div>
                  <BookOpen className="h-10 w-10 mb-4" />
                  <h3 className="font-bold text-xl mb-3">Kelas Kaiwa</h3>
                  <p className="text-white/90 mb-4">
                    Percakapan sehari-hari untuk komunikasi lancar di lingkungan kerja
                  </p>
                  <div className="flex items-center font-semibold">
                    Mulai Belajar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* JLPT Card */}
              <Link href="/classes?type=jlpt" className="group">
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">📚</div>
                  <GraduationCap className="h-10 w-10 mb-4" />
                  <h3 className="font-bold text-xl mb-3">Persiapan JLPT</h3>
                  <p className="text-white/90 mb-4">
                    Raih sertifikasi JLPT N5 hingga N1 dengan materi terstruktur
                  </p>
                  <div className="flex items-center font-semibold">
                    Mulai Belajar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Intensif Card */}
              <Link href="/classes?type=intensif" className="group">
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">🎯</div>
                  <Award className="h-10 w-10 mb-4" />
                  <h3 className="font-bold text-xl mb-3">Kelas Intensif</h3>
                  <p className="text-white/90 mb-4">
                    Program intensif untuk persiapan kerja di perusahaan Jepang
                  </p>
                  <div className="flex items-center font-semibold">
                    Mulai Belajar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-10">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-brand-primary to-purple-700 hover:from-purple-700 hover:to-brand-primary text-white font-bold px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/classes">
                  Lihat Semua Kelas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section - VIBRANT GRADIENT */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-pink-500 to-purple-600" />
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="container mx-auto max-w-4xl text-center relative">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-bold text-white">100% Gratis untuk Pencari Kerja</span>
            </div>
            
            <h2 className="text-5xl font-black text-white mb-6">
              Siap Memulai Petualangan Karir di Jepang?
            </h2>
            <p className="text-2xl text-white/95 mb-10 max-w-3xl mx-auto">
              Bergabung dengan ribuan profesional Indonesia yang telah sukses meraih impian mereka
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-brand-primary hover:bg-gray-100 font-bold px-10 py-6 text-lg shadow-2xl hover:scale-110 transition-all duration-200"
              >
                <Link href="/auth/sign-up">
                  <Users className="mr-2 h-5 w-5" />
                  Daftar Sebagai Pencari Kerja
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold px-10 py-6 text-lg hover:scale-105 transition-all duration-200"
              >
                <Link href="/auth/sign-up">
                  <Building2 className="mr-2 h-5 w-5" />
                  Daftar Sebagai Perusahaan
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer - COLORFUL GRADIENT */}
        <footer className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 border-t-2 border-purple-100">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-lg font-black text-white">S</span>
                  </div>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">SAMIT</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Platform terpercaya untuk mewujudkan karir impian di Jepang
                </p>
                <div className="flex gap-3 mt-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md">
                    <span className="text-sm">📧</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md">
                    <span className="text-sm">📱</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md">
                    <span className="text-sm">💼</span>
                  </div>
                </div>
              </div>
              
              {/* Pencari Kerja */}
              <div>
                <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pencari Kerja</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/jobs" className="text-gray-700 hover:text-brand-primary font-medium transition-colors flex items-center gap-2">
                      <span>✨</span>
                      Cari Lowongan
                    </Link>
                  </li>
                  <li>
                    <Link href="/companies" className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2">
                      <span>🏢</span>
                      Daftar Perusahaan
                    </Link>
                  </li>
                  <li>
                    <Link href="/classes" className="text-gray-700 hover:text-green-600 font-medium transition-colors flex items-center gap-2">
                      <span>📚</span>
                      Kelas Bahasa
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Perusahaan */}
              <div>
                <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Perusahaan</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/auth/sign-up" className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2">
                      <span>📝</span>
                      Posting Lowongan
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                      <span>📊</span>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center gap-2">
                      <span>💎</span>
                      Paket Premium
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Kontak */}
              <div>
                <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Hubungi Kami</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-lg">📧</span> 
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">info@sakuramitra.com</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-lg">📞</span> 
                    <span className="hover:text-green-600 cursor-pointer transition-colors">+62 21 1234 5678</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-lg">📍</span> 
                    <span>Jakarta, Indonesia</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom */}
            <div className="border-t-2 border-purple-100 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-700 font-medium">
                  © 2025 <span className="font-bold bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">SAMIT</span> - Sakura Mitra Indonesia. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                  <Link href="/privacy" className="text-gray-700 hover:text-brand-primary font-medium transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Terms of Service</Link>
                  <Link href="/help" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Help Center</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
