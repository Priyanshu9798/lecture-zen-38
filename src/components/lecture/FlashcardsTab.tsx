import { useState } from 'react';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, ChevronRight } from 'lucide-react';

interface FlashcardsTabProps {
  flashcards: Flashcard[];
}

export default function FlashcardsTab({ flashcards }: FlashcardsTabProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);

  const card = flashcards[current];
  if (!card) return null;

  const handleRate = (difficulty: number) => {
    setRated(true);
    // In real app, send to API
  };

  const next = () => {
    if (current + 1 < flashcards.length) {
      setCurrent(current + 1);
      setFlipped(false);
      setRated(false);
    } else {
      setCurrent(0);
      setFlipped(false);
      setRated(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {current + 1} of {flashcards.length}</span>
        <span>Next review: {card.nextReview}</span>
      </div>
      <Progress value={((current + 1) / flashcards.length) * 100} className="h-2" />

      <div className="perspective-1000" style={{ perspective: '1000px' }}>
        <div
          className="relative cursor-pointer transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}
          onClick={() => !flipped && setFlipped(true)}
        >
          {/* Front */}
          <Card className="min-h-[200px] flex items-center justify-center p-8" style={{ backfaceVisibility: 'hidden' }}>
            <CardContent className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Question</p>
              <p className="text-lg font-medium">{card.question}</p>
              {!flipped && <p className="mt-4 text-xs text-muted-foreground">Click to reveal answer</p>}
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="absolute inset-0 min-h-[200px] flex items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CardContent className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Answer</p>
              <p className="text-lg">{card.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {flipped && (
        <div className="space-y-3">
          {!rated ? (
            <div>
              <p className="mb-2 text-center text-sm text-muted-foreground">How difficult was this?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(d => (
                  <Button key={d} variant={d <= 2 ? 'default' : d <= 4 ? 'secondary' : 'outline'} size="sm" onClick={() => handleRate(d)}>
                    {d}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button onClick={next}>
                {current + 1 < flashcards.length ? <><ChevronRight className="mr-1 h-4 w-4" />Next Card</> : <><RotateCcw className="mr-1 h-4 w-4" />Start Over</>}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
