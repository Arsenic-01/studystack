'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { EllipsisVertical, Info } from 'lucide-react';
import { NoteCardProps } from './note-card';
import { Button } from './ui/button';
import { deleteNote } from '@/lib/actions/Notes.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
const CardOwner = ({
  note,
  formattedDate,
}: NoteCardProps & { formattedDate: string }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size={'icon'}>
            {user?.userId === note.users.userId || user?.role === 'admin' ? (
              <EllipsisVertical />
            ) : (
              <Info />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>Uploaded by {note.users.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Uploaded at {formattedDate}</DropdownMenuLabel>
          {(user?.userId === note.users.userId || user?.role === 'admin') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  deleteNote({ noteId: note.noteId, fileId: note.fileId })
                    .then(() => toast.success('Note deleted successfully'))
                    .catch(() => toast.error('Error deleting note'));

                  router.refresh();
                }}
              >
                Delete Note
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CardOwner;
