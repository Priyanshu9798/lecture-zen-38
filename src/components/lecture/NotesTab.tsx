import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotesTabProps {
  initialNotes: string;
}

export default function NotesTab({ initialNotes }: NotesTabProps) {
  const [notes, setNotes] = useState(initialNotes);
  const { toast } = useToast();

  const save = () => {
    toast({ title: 'Notes saved', description: 'Your notes have been saved successfully.' });
  };

  return (
    <div className="space-y-3">
      <Textarea
        className="min-h-[40vh] resize-none font-serif text-base leading-relaxed"
        placeholder="Write your personal notes here..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={save} size="sm"><Save className="mr-1.5 h-4 w-4" />Save Notes</Button>
      </div>
    </div>
  );
}
