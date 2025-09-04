import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "./QueryProvider";
import { Providers } from "./providers";
import "./globals.css";
import Footer from "@/components/core/Footer";
import Header from "@/components/core/navbar/Header";
import { hostedAt } from "@/data";
import { getCurrentUser } from "@/lib/auth";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(hostedAt),

  title: {
    default: "StudyStack | K.K. Wagh Polytechnic",
    template: "%s | StudyStack",
  },
  description:
    "The official resource platform for Computer Technology students.",

  keywords: [
    "StudyStack",
    "K.K. Wagh Polytechnic",
    "KKWagh",
    "Nashik",
    "Computer Technology",
    "MSBTE Notes",
    "Study Materials",
    "Educational Resources",
  ],

  authors: [{ name: "Vedant Bhor, Tanay Hingane, Adarsh Tile, Yadnesh Udar" }],
  creator: "The StudyStack Team",

  openGraph: {
    title: "StudyStack | K.K. Wagh Polytechnic",
    description:
      "The official resource platform for Computer Technology students.",
    url: hostedAt,
    siteName: "StudyStack",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "StudyStack Social Media Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "StudyStack | Your Academic Resource Hub at K.K. Wagh Polytechnic",
    description: "Access all your notes and study materials in one place.",
    images: ["/og"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StudyStack",
              url: hostedAt,
              publisher: {
                "@type": "Organization",
                name: "K.K. Wagh Polytechnic, Nashik",
                logo: {
                  "@type": "ImageObject",
                  url: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/college.png",
                },
              },
            }),
          }}
        />
      </head>
      <body className={`${dmSans.className} antialiased`}>
        <Providers>
          <ReactQueryProvider>
            <Header serverUser={user} />
            {children}
            <SpeedInsights />
            <Toaster richColors />
            <Footer />
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
