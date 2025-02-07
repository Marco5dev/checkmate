import { Poppins } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { getServerSession } from "next-auth";
import AuthProvider from "@/utils/SessionsProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const eduFont = localFont({
  src: [
    {
      path: '../public/fonts/Edu_font/EduAUVICWANTPre-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Edu_font/EduAUVICWANTPre-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Edu_font/EduAUVICWANTPre-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Edu_font/EduAUVICWANTPre-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-edu',
});

const merriweather = localFont({
  src: [
    {
      path: '../public/fonts/Merriweather/Merriweather-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Merriweather/Merriweather-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Merriweather/Merriweather-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Merriweather/Merriweather-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-merriweather',
});

export const metadata = {
  metadataBase: new URL("https://checkmate.marco5dev.me"),
  title: {
    default: "CheckMate",
    template: "%s | CheckMate",
  },
  description:
    "CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration.",
  keywords: [
    "task management",
    "notes",
    "productivity",
    "organization",
    "todo list",
    "inspiration",
  ],
  authors: [{ name: "marco5dev", url: "https://marco5dev.me" }],
  creator: "marco5dev",
  publisher: "marco5dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: "CheckMate",
    title: "CheckMate",
    description:
      "CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration.",
    url: "https://checkmate.marco5dev.me",
    images: [
      {
        url: "/api/og", // Updated path
        width: 1200,
        height: 630,
        alt: "CheckMate OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CheckMate",
    description:
      "CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration.",
    images: ["/api/og"], // Updated path
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({ children, params }) {
  const dir = params.locale === "ar" ? "rtl" : "ltr";
  const session = await getServerSession();
  return (
    <html lang={params.locale} dir={dir} data-theme="dark" className={`${eduFont.variable} ${merriweather.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Add preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Add structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CheckMate",
              description:
                "CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration.",
              url: "https://checkmate.marco5dev.me",
              author: {
                "@type": "Person",
                name: "marco5dev",
                url: "https://marco5dev.me",
              },
              applicationCategory: "Productivity",
              operatingSystem: "Web",
            }),
          }}
        />

        <title>CheckMate</title>

        {/* Meta Tags */}
        <meta
          name="description"
          content="CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration."
        />
        <meta
          name="keywords"
          content="task management, notes,productivity, organization, todo list, inspiration"
        />
        <meta name="author" content="marco5dev (Mark Maher)" />
        <meta name="creator" content="marco5dev (Mark Maher)" />
        <meta name="publisher" content="marco5dev (Mark Maher)" />
        <meta name="robots" content="index, follow" />

        {/* Canonical Link */}
        <link rel="canonical" href="https://checkmate.marco5dev.me/" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="CheckMate" />
        <meta
          property="og:description"
          content="CheckMate is a sleek and intuitive app designed to help you stay on top of your tasks, organize your thoughts, and find daily inspiration."
        />
        <meta property="og:url" content="https://checkmate.marco5dev.me" />
        <meta property="og:site_name" content="CheckMate" />
        <meta
          property="og:image"
          content="https://checkmate.marco5dev.me/api/og"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CheckMate OG Image" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Add KaTeX CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
        <style>{`
          :root {
            --wallpaper: url('/wallpapers/login.png');
          }
        `}</style>
      </head>
      <body className={poppins.className}>
        <AuthProvider session={session}>
          <SettingsProvider>
            <HeaderWrapper />
            {children}
            <Toaster position="bottom-center" />
          </SettingsProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
