import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/80" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#ff6154]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#2B3E7C]/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <LoginForm />
      </div>
    </div>
  );
}
