// app/(app)/layout.tsx

import Footer from "@/components/core/layout/Footer";
import HeaderProvider from "@/components/core/layout/HeaderProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderProvider />
      <main>{children}</main>
      <Footer />
    </>
  );
}
