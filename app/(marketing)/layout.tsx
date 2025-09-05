// app/(marketing)/layout.tsx

import Footer from "@/components/core/Footer";
import Header from "@/components/core/navbar/Header";

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
