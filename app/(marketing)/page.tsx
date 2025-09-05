import LoginPage from "@/components/core/auth/LoginPage";

const page = () => {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center py-32 xl:py-36 px-5"
      suppressHydrationWarning
    >
      <LoginPage />
    </main>
  );
};

export default page;
