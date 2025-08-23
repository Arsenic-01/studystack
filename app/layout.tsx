import ConditionalHeader from "@/components/core/ConditionalHeader";
import Footer from "@/components/core/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import ReactQueryProvider from "./QueryProvider";

// const inter = Inter({ subsets: ["latin"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Study Stack",
  description:
    "Study Stack is a platform where teachers/faculty can upload notes and resources for their respected subjects and students can access them, much like Google Classroom, but better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/title_logo.png" sizes="any" />
      </head>
      <body className={`${dmSans.className} antialiased`}>
        <Providers>
          <ReactQueryProvider>
            <ConditionalHeader />
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
