import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

interface AudioPlayerProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
  duration: number;
}

export default function AudioPlayer({ currentTime, onTimeChange, duration }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        onTimeChange(Math.min(currentTime + 1, duration));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, currentTime, duration, onTimeChange]);

  useEffect(() => {
    if (currentTime >= duration) setPlaying(false);
  }, [currentTime, duration]);

  const skip = (delta: number) => {
    onTimeChange(Math.max(0, Math.min(duration, currentTime + delta)));
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => skip(-10)}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button size="icon" onClick={() => setPlaying(!playing)} className="h-10 w-10 rounded-full">
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => skip(10)}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <span className="min-w-[5rem] text-center text-sm font-mono text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <Slider
          className="flex-1"
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={([v]) => onTimeChange(v)}
        />
      </div>
    </div>
  );
}
