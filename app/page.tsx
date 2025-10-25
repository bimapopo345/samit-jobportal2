import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MapPin, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobWithOrg = {
  id: string;
  slug: string;
  title: string;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: string;
  created_at: string;
  organizations: { display_name: string } | null;
};

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select(`
      id, 
      slug, 
      title, 
      location_city, 
      salary_min, 
      salary_max, 
      employment_type, 
      created_at,
      organizations!inner(display_name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6) as { data: JobWithOrg[] | null };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero Section - SAMIT Style */}
        <section className="relative bg-[#FFF8F0] py-12 md:py-20 px-4 overflow-hidden">
          {/* Decorative Sakura Flowers */}
          <div className="absolute top-8 left-8 md:top-16 md:left-16 w-12 h-12 md:w-16 md:h-16 opacity-40">
            <svg viewBox="0 0 100 100" className="text-pink-300 fill-current">
              <path d="M50,10 L55,35 L80,30 L60,50 L80,70 L55,65 L50,90 L45,65 L20,70 L40,50 L20,30 L45,35 Z" />
            </svg>
          </div>
          <div className="absolute top-20 right-16 md:top-28 md:right-32 w-10 h-10 md:w-16 md:h-16 opacity-40">
            <svg viewBox="0 0 100 100" className="text-pink-300 fill-current">
              <path d="M50,10 L55,35 L80,30 L60,50 L80,70 L55,65 L50,90 L45,65 L20,70 L40,50 L20,30 L45,35 Z" />
            </svg>
          </div>
          <div className="absolute bottom-28 left-1/4 w-8 h-8 md:w-12 md:h-12 opacity-30">
            <svg viewBox="0 0 100 100" className="text-pink-200 fill-current">
              <path d="M50,10 L55,35 L80,30 L60,50 L80,70 L55,65 L50,90 L45,65 L20,70 L40,50 L20,30 L45,35 Z" />
            </svg>
          </div>

          {/* Decorative Lollipop */}
          <div className="hidden lg:block absolute bottom-32 right-12 w-20 h-20 opacity-60">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-4 border-white shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"></div>
            </div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative">
            {/* Decorative Profile Photos */}
            <div className="hidden lg:block absolute left-0 top-20 z-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute right-0 top-4 z-10">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute right-24 bottom-8 z-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-4xl mx-auto text-center">
              {/* Japanese Flag Icon */}
              <div className="hidden lg:block absolute -left-32 top-8">
                <div className="relative w-24 h-16 transform -rotate-12">
                  <div className="absolute inset-0 bg-white border-2 border-gray-300 rounded"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 rounded-full"></div>
                  <div className="absolute -bottom-2 left-0 w-1 h-24 bg-gray-700"></div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#2B3E7C] mb-4 leading-tight px-4">
                Temukan Pekerjaan Impianmu di Jepang
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-10 px-4">
                Daftar sekarang untuk lowongan profesional dan <span className="italic font-semibold">fresh graduates</span>
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Job Title Input */}
                  <div className="md:col-span-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="text" 
                        placeholder="Jobs title or keywords" 
                        className="pl-10 h-12 border-gray-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* City Selector */}
                  <div className="md:col-span-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                      <Select>
                        <SelectTrigger className="h-12 pl-10 border-gray-300 text-sm">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          <SelectItem value="tokyo">Tokyo</SelectItem>
                          <SelectItem value="osaka">Osaka</SelectItem>
                          <SelectItem value="nagoya">Nagoya</SelectItem>
                          <SelectItem value="kyoto">Kyoto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Category Selector */}
                  <div className="md:col-span-3">
                    <Select>
                      <SelectTrigger className="h-12 border-gray-300 text-sm">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="it">IT & Software</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Buttons */}
                  <div className="md:col-span-2 flex gap-2">
                    <Button 
                      variant="ghost" 
                      className="h-12 text-gray-600 hover:text-gray-900 text-sm px-4"
                    >
                      Clear
                    </Button>
                    <Button 
                      className="h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FF5555] hover:from-[#FF5555] hover:to-[#FF4444] text-white font-bold shadow-lg text-sm px-6"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {/* 30+ Trusted */}
                <div className="flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-[#2B3E7C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-[#2B3E7C]">30+ Trusted</div>
                    <div className="text-xs text-gray-600 font-medium">Client Company</div>
                  </div>
                </div>

                {/* 100% Free */}
                <div className="flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-[#2B3E7C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-[#2B3E7C]">100% Free</div>
                    <div className="text-xs text-gray-600 font-medium">No hidden costs!</div>
                  </div>
                </div>

                {/* Full Support */}
                <div className="flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-[#2B3E7C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-[#2B3E7C]">Full support</div>
                    <div className="text-xs text-gray-600 font-medium">Relocation & Visa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Companies Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-12">
              Beberapa Klien yang Bekerja Sama dengan SAMIT
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 items-center justify-items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-20 h-16 md:w-24 md:h-20 bg-gray-100 rounded flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="text-xs text-gray-400 font-bold">Company {i}</div>
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-12">
              Temukan Layanan Lainnya
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Tokutei Ginou Card */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                <div className="bg-gradient-to-br from-[#3B5998] to-[#2C4679] p-8 md:p-10 min-h-[400px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      SAMIT Tokutei Ginou
                    </h3>
                    <p className="text-white/90 text-base md:text-lg mb-6">
                      Platform pencarian kerja populer untuk program Tokutei Ginou (Specified Skilled Worker).
                    </p>
                    <Button className="bg-[#FF6B6B] hover:bg-[#FF5555] text-white font-bold rounded-full">
                      Coming soon
                    </Button>
                    </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 opacity-20">
                    <div className="w-full h-full rounded-full bg-white/10"></div>
                  </div>
                </div>
              </div>

              {/* Language School Card */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF4545] p-8 md:p-10 min-h-[400px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      SAMIT Language School
                    </h3>
                    <p className="text-white/90 text-base md:text-lg mb-6">
                      Tingkatkan kemampuan bahasa Jepang kamu dengan bergabung SAMIT Language School.
                    </p>
                    <Button className="bg-[#3B5998] hover:bg-[#2C4679] text-white font-bold rounded-full">
                      Coming soon
                    </Button>
                  </div>
                  
                  {/* Decorative Japanese Flag */}
                  <div className="absolute bottom-8 right-8 opacity-30">
                    <div className="relative w-20 h-14">
                      <div className="absolute inset-0 bg-white rounded"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-12">
              Jelajahi Lowongan Pekerjaan di Perusahaan Klien Kami
            </h2>
            
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs && featuredJobs.length > 0 ? (
                  featuredJobs.map((job) => (
                    <Link 
                      key={job.id} 
                      href={`/jobs/${job.slug}`}
                      className="block bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-[#FF6B6B] transition-all group"
                    >
                      {/* Heart Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                          <div className="text-white font-bold text-lg">
                            {job.organizations?.display_name?.charAt(0) || 'J'}
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                      </div>

                      <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-[#FF6B6B] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by <span className="font-semibold">{job.organizations?.display_name || 'Company'}</span> in
                      </p>
                      <p className="text-sm text-[#FF6B6B] font-semibold mb-4">Business & Operations</p>

                      <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            {job.employment_type === 'fulltime' ? 'Full Time' : 'Contract'}
                          </span>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 text-[#FF6B6B]" />
                            <span className="text-xs">{job.location_city || 'Tokyo'}</span>
                          </div>
                        </div>
                      </div>

                      {job.salary_min && job.salary_max ? (
                        <div className="mt-3 text-[#FF6B6B] font-bold text-sm">
                          Min: ¥{(job.salary_min / 1000).toFixed(0)}K/month
                        </div>
                      ) : null}
                    </Link>
                  ))
                ) : (
                  // Placeholder cards
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white border-2 border-gray-100 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-100 rounded mb-4 w-2/3 animate-pulse"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-100 rounded w-20 animate-pulse"></div>
                          <div className="h-6 bg-gray-100 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="text-center mt-10">
                <Button 
                  asChild
                  variant="outline" 
                  className="border-2 border-[#2B3E7C] text-[#2B3E7C] hover:bg-[#2B3E7C] hover:text-white font-bold px-8 rounded-full"
                >
                  <Link href="/jobs">View all jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#FFF8F0] to-[#FFF0E5] relative overflow-hidden">
          {/* Decorative curve background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
              <path fill="#FFE4C4" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Photo */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#FF7A5A] to-[#FF5A3A] p-2 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white p-3 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -left-6 text-4xl animate-pulse">✨</div>
                  <div className="absolute -top-2 -right-8 text-3xl">🌸</div>
                  <div className="absolute bottom-8 -left-12 text-3xl">📚</div>
                  <div className="absolute bottom-2 -right-10 text-3xl">✈️</div>
                  
                  {/* Plus signs decoration */}
                  <div className="absolute -top-10 left-10 text-[#2B3E7C] font-bold text-3xl">
                    <div className="space-y-1">
                      <div>+ + +</div>
                      <div>+ + +</div>
                      <div>+ + +</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Stats */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2B3E7C] mb-6">
                  Pencapaian Kami
                </h2>
                <p className="text-gray-700 text-lg mb-10">
                  Pencapaian yang membuktikan dedikasi kami dalam menghubungkan talenta hebat dengan peluang terbaik
                </p>

                <div className="space-y-8">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Registered Candidates</div>
                    <div className="text-5xl md:text-6xl font-bold text-[#FF6B6B]">8,000+</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Social Media Followers</div>
                    <div className="text-5xl md:text-6xl font-bold text-[#FF6B6B]">50,000+</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Trusted Partners & Clients</div>
                    <div className="text-5xl md:text-6xl font-bold text-[#FF6B6B]">30+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-[#FFF8F0]">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-16">
              Raih mimpimu bersama SAMIT
            </h2>
            
            <div className="relative">
              {/* Testimonial Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mufi Ahdallah</h3>
                  <p className="text-gray-600 text-sm">Software Engineer di Komatsu Kaihatsu Co., Ltd.</p>
                </div>

                <p className="text-gray-700 text-center text-base md:text-lg leading-relaxed mb-8">
                  Berkat SAMIT, saya bisa mendapatkan pekerjaan impian saya, saya benar-benar di-support dari NOL. 
                  Bahkan setelah bekerja pun, saya masih sering ngobrol dan mendapatkan banyak nasehat dari mentor saya. 
                  I really appreciate it, terima kasih SAMIT!
                </p>

                {/* Profile Photo */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    </div>
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B6B]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
            </div>
            
              {/* Navigation Arrows */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-12">
              Partner Kami
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-24 h-20 bg-gray-100 rounded flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="text-xs text-gray-400 font-bold">Partner {i}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Coverage Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2B3E7C] mb-12">
              Media Coverage
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="text-xs text-gray-400 font-bold">Media {i}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-[#FFF8F0]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Belum menemukan lowongan yang cocok?
              </h2>
              <p className="text-gray-700 mb-8 text-base md:text-lg">
                Submit CV kamu dan gabung ke Free Membership kami. Kandidat terpilih akan diundang untuk mengikuti job matching.
              </p>
              <Button 
                asChild 
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5555] hover:from-[#FF5555] hover:to-[#FF4444] text-white font-bold px-8 py-6 text-lg rounded-full shadow-xl"
              >
                <Link href="/auth/sign-up">Submit CV Sekarang</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left - Logo & Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="SAMIT Logo" 
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-bold text-xl text-[#2B3E7C]">SAMIT</div>
                    <div className="text-sm text-gray-600">Sakura Mitra Indonesia</div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-4">Enquiries</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">Sakura Mitra Indonesia</p>
                  <p>Ruko Dalton Utara Blok DLNU 05</p>
                  <p>Jl. Scientia Square Selatan</p>
                  <p>Kelurahan Curug Sangereng, Kecamatan Klp. Dua</p>
                  <p>Kabupaten Tangerang, Banten 15810</p>
                  <p className="mt-4">Email: contact@sakuramitra.com</p>
                </div>
              </div>

              {/* Right - Connect */}
              <div className="text-right">
                <h3 className="font-bold text-lg mb-4">Connect</h3>
                <div className="flex gap-3 justify-end">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">📷</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">💼</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <span className="text-lg">📘</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom */}
            <div className="border-t pt-8 text-center text-sm text-gray-600">
              <p>© 2025 SAMIT - Sakura Mitra Indonesia. All Right Reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
