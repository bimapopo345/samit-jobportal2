// SAMIT Design System - Consistent styles across all pages

export const colors = {
  // Primary gradients
  primaryGradient: "bg-gradient-to-r from-brand-primary to-brand-dark",
  primaryGradientHover: "hover:from-brand-dark hover:to-brand-primary",
  
  // Accent gradients
  accentGradient: "bg-gradient-to-r from-brand-accent to-pink-500",
  
  // Category gradients
  categoryGradients: {
    "dalam-negeri": "bg-gradient-to-r from-blue-500 to-blue-600",
    "jepang": "bg-gradient-to-r from-red-500 to-pink-600", 
    "ex-jepang": "bg-gradient-to-r from-purple-500 to-indigo-600",
  },
  
  // Status gradients
  statusGradients: {
    pending: "bg-gradient-to-r from-yellow-400 to-orange-500",
    verified: "bg-gradient-to-r from-green-500 to-emerald-600",
    rejected: "bg-gradient-to-r from-red-500 to-rose-600",
    active: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  
  // Card backgrounds
  cardGradients: [
    "bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50",
    "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50",
    "bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50",
    "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
    "bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50",
    "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50",
  ],
};

export const typography = {
  // Headers - BOLD and DARK
  h1: "text-4xl font-bold text-gray-900",
  h2: "text-3xl font-bold text-gray-900", 
  h3: "text-2xl font-bold text-gray-900",
  h4: "text-xl font-semibold text-gray-900",
  
  // Body text - READABLE
  body: "text-gray-700",
  bodySmall: "text-sm text-gray-700",
  muted: "text-gray-600",
  
  // Links
  link: "text-brand-primary hover:text-brand-dark font-medium transition-colors",
};

export const cards = {
  // Base card with subtle gradient and shadow
  base: "bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden",
  
  // Gradient cards for stats
  statCard: "rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border",
  
  // Interactive cards
  interactive: "bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-gray-100 cursor-pointer",
};

export const buttons = {
  // Primary with gradient
  primary: "bg-gradient-to-r from-brand-primary to-brand-dark text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200",
  
  // Secondary colorful
  secondary: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200",
  
  // Accent
  accent: "bg-gradient-to-r from-brand-accent to-pink-500 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200",
  
  // Outline but colorful
  outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold transition-all duration-200",
};

export const badges = {
  // Status badges with gradients
  status: {
    pending: "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200",
    active: "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200",
    inactive: "bg-gradient-to-r from-gray-100 to-slate-100 text-slate-700 border border-slate-200",
    verified: "bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border border-indigo-200",
  },
  
  // Category badges
  category: {
    default: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
    jlpt: "bg-gradient-to-r from-green-100 to-teal-100 text-teal-800 border border-teal-200",
    work: "bg-gradient-to-r from-blue-100 to-cyan-100 text-cyan-800 border border-cyan-200",
  },
};

export const layouts = {
  // Page sections with gradient backgrounds
  heroSection: "bg-gradient-to-br from-brand-primary via-brand-dark to-indigo-900 text-white",
  
  // Dashboard sections
  dashboardHeader: "bg-gradient-to-r from-white to-gray-50 border-b border-gray-200",
  
  // Sidebar
  sidebarActive: "bg-gradient-to-r from-brand-primary to-brand-dark text-white",
  sidebarHover: "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200",
};

export const animations = {
  // Smooth transitions
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom duration-500",
  
  // Hover effects
  scaleHover: "hover:scale-105 transition-transform duration-200",
  liftHover: "hover:-translate-y-1 hover:shadow-xl transition-all duration-200",
};
