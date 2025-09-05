// app/(legal)/layout.tsx

import Footer from "@/components/core/layout/Footer";
import Header from "@/components/core/layout/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
