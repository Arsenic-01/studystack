import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, Download } from 'lucide-react';

export interface NoteCardProps {
  note: {
    noteId: string;
    title: string;
    description: string;
    createdAt: string;
    fileId: string;
    users: {
      name: string;
    };
  };
  previewUrl: string;
}

export function NoteCard({ note, previewUrl }: NoteCardProps) {
  // Format the createdAt date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(note.createdAt));

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold truncate'>
          {note.title}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow'>
        <div className='aspect-video relative mb-4'>
          {/* Use the previewUrl as the image source */}
          <Image
            src={previewUrl || '/jerry.jpg'} // Fallback to '/jerry.jpg' if previewUrl is empty
            alt={note.title}
            fill
            className='object-contain rounded-md'
          />
        </div>
        <p className='text-base text-muted-foreground mb-2 line-clamp-2'>
          {note.description}
        </p>
        <p className='text-xs text-muted-foreground'>
          Uploaded by: {note.users.name}
        </p>
        <p className='text-xs text-muted-foreground'>
          Uploaded at: {formattedDate}
        </p>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <Button className='w-full'>
          View Online <ArrowUpRight className='ml-2 h-4 w-4' />
        </Button>
        <Button variant='outline' className='w-full'>
          Download <Download className='ml-2 h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
