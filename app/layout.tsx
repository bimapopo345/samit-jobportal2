import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Suspense } from "react";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SAMIT Job Portal - Japan Employment Opportunities",
  description: "Find jobs in Japan, connect with Japanese companies, and access Japanese language classes. Specialized platform for Indonesia-Japan employment.",
  keywords: "jobs japan, kerja di jepang, lowongan jepang, JLPT, nihongo, gijinkoku",
  authors: [{ name: "SAMIT - Sakura Mitra Indonesia" }],
  openGraph: {
    title: "SAMIT Job Portal - Japan Employment Opportunities",
    description: "Find jobs in Japan, connect with Japanese companies, and access Japanese language classes",
    url: defaultUrl,
    siteName: "SAMIT Job Portal",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAMIT Job Portal",
    description: "Japan Employment & Learning Platform",
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
