import SubjectForm from "@/components/SubjectForm";

export default function Home() {
  return (
    <main className="container mx-auto py-32 lg:py-48">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Subject</h1>
      <SubjectForm />
    </main>
  );
}
