import { useState } from 'react';
import type { QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizTabProps {
  questions: QuizQuestion[];
}

export default function QuizTab({ questions }: QuizTabProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q?.correctIndex;
  const score = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
  const pct = Math.round((score / questions.length) * 100);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers([...answers, selected]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚';
    return (
      <Card className="text-center py-10">
        <CardContent className="space-y-4">
          <p className="text-6xl">{emoji}</p>
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <p className="text-4xl font-bold text-primary">{pct}%</p>
          <p className="text-muted-foreground">{score} out of {questions.length} correct</p>
          <Button onClick={restart} variant="outline"><RotateCcw className="mr-2 h-4 w-4" />Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {current + 1} of {questions.length}</span>
        <span>{Math.round(((current) / questions.length) * 100)}% complete</span>
      </div>
      <Progress value={(current / questions.length) * 100} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {q.options.map((opt, i) => {
            let cls = 'w-full justify-start text-left ';
            if (submitted) {
              if (i === q.correctIndex) cls += 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 ';
              else if (i === selected) cls += 'border-destructive bg-destructive/10 text-destructive ';
            }
            return (
              <Button
                key={i}
                variant={selected === i && !submitted ? 'default' : 'outline'}
                className={cls}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
              >
                <span className="mr-2 font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                {opt}
              </Button>
            );
          })}

          {submitted && (
            <div className={`mt-4 flex items-start gap-2 rounded-lg p-3 ${isCorrect ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
              {isCorrect ? <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" /> : <XCircle className="mt-0.5 h-5 w-5 text-destructive" />}
              <p className="text-sm">{q.explanation}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {!submitted ? (
              <Button onClick={handleSubmit} disabled={selected === null}>Submit Answer</Button>
            ) : (
              <Button onClick={handleNext}>{current + 1 >= questions.length ? 'See Results' : 'Next Question'}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
