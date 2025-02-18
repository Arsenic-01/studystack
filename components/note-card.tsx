import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ArrowUpRight, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CardOwner from './CardOwner';
export interface NoteCardProps {
  note: {
    noteId: string;
    title: string;
    description: string;
    createdAt: string;
    fileId: string;
    users: {
      name: string;
      userId: string;
    };
  };
}

export function NoteCard({ note }: NoteCardProps) {
  // Format the createdAt date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(note.createdAt));

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader>
        <div className='flex justify-between'>
          <CardTitle className='text-lg font-semibold truncate'>
            {note.title}
          </CardTitle>
          <CardOwner note={note} formattedDate={formattedDate} />
        </div>
      </CardHeader>

      <CardContent className='flex-grow'>
        <div className='aspect-video relative mb-4'>
          {/* Use the previewUrl as the image source */}
          <Image
            src={
              `https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${note.fileId}/preview?project=679a700c0013ee3706ba` ||
              '/jerry.jpg'
            } // Fallback to '/jerry.jpg' if previewUrl is empty
            alt={note.title}
            fill
            className='object-cover rounded-md pointer-events-none select-none'
          />
        </div>
        <p className='text-base text-muted-foreground mb-2 line-clamp-2'>
          {note.description}
        </p>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <Button className='w-full' asChild>
          <Link
            href={`https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${note.fileId}/view?project=679a700c0013ee3706ba`}
            target='_blank'
          >
            {' '}
            View Online <ArrowUpRight className='ml-1 h-4 w-4' />
          </Link>
        </Button>
        <Button variant='outline' className='w-full' asChild>
          <Link
            href={`https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${note.fileId}/download?project=679a700c0013ee3706ba`}
            className='inline-flex'
          >
            {' '}
            Download <Download className='ml-1 h-4 w-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
