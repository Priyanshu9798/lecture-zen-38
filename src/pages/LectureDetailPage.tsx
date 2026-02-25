import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLectureDetail } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import AudioPlayer from '@/components/lecture/AudioPlayer';
import TranscriptTab from '@/components/lecture/TranscriptTab';
import SummaryTab from '@/components/lecture/SummaryTab';
import NotesTab from '@/components/lecture/NotesTab';
import QuizTab from '@/components/lecture/QuizTab';
import FlashcardsTab from '@/components/lecture/FlashcardsTab';
import ChatTab from '@/components/lecture/ChatTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, BookOpen, Pencil, Brain, Layers, MessageCircle } from 'lucide-react';

export default function LectureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['lecture', id],
    queryFn: () => getLectureDetail(id!),
    enabled: !!id,
  });

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container max-w-4xl py-8 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!data) return null;

  return (
    <AppLayout>
      <div className="container max-w-4xl py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{data.lecture.title}</h1>
          <p className="text-sm text-muted-foreground">{data.lecture.date} · {Math.round(data.lecture.duration / 60)} minutes</p>
        </div>

        <AudioPlayer currentTime={currentTime} onTimeChange={handleTimeChange} duration={data.lecture.duration} />

        <Tabs defaultValue="transcript">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="transcript" className="gap-1"><FileText className="h-3.5 w-3.5 hidden sm:block" />Transcript</TabsTrigger>
            <TabsTrigger value="summary" className="gap-1"><BookOpen className="h-3.5 w-3.5 hidden sm:block" />Summary</TabsTrigger>
            <TabsTrigger value="notes" className="gap-1"><Pencil className="h-3.5 w-3.5 hidden sm:block" />Notes</TabsTrigger>
            <TabsTrigger value="quiz" className="gap-1"><Brain className="h-3.5 w-3.5 hidden sm:block" />Quiz</TabsTrigger>
            <TabsTrigger value="flashcards" className="gap-1"><Layers className="h-3.5 w-3.5 hidden sm:block" />Flashcards</TabsTrigger>
            <TabsTrigger value="chat" className="gap-1"><MessageCircle className="h-3.5 w-3.5 hidden sm:block" />Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript">
            <TranscriptTab segments={data.transcript} currentTime={currentTime} onSeek={handleTimeChange} />
          </TabsContent>
          <TabsContent value="summary">
            <SummaryTab sections={data.summary} />
          </TabsContent>
          <TabsContent value="notes">
            <NotesTab initialNotes={data.notes} />
          </TabsContent>
          <TabsContent value="quiz">
            <QuizTab questions={data.quiz} />
          </TabsContent>
          <TabsContent value="flashcards">
            <FlashcardsTab flashcards={data.flashcards} />
          </TabsContent>
          <TabsContent value="chat">
            <ChatTab lectureId={id!} onTimestampClick={handleTimeChange} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
