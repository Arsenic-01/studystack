import SubjectForm from '@/components/SubjectForm';

export default function Home() {
  return (
    <main className='container mx-auto py-36 xl:py-40 px-5'>
      <div className=' mb-10 text-center'>
        {' '}
        <h1 className='text-3xl font-bold'>Add New Subject</h1>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Fill out the form below to add a new subject.
        </p>
      </div>

      <SubjectForm />
    </main>
  );
}
