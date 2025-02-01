import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import ReactQueryProvider from "./QueryProvider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ReactQueryProvider>
            <AuthProvider>
              <Header />
              {children}
              <Toaster richColors />
              <Footer />
            </AuthProvider>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
