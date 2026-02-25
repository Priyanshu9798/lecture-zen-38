import type { TranscriptSegment } from '@/types';

function formatTimestamp(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

interface TranscriptTabProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function TranscriptTab({ segments, currentTime, onSeek }: TranscriptTabProps) {
  return (
    <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
      {segments.map(seg => {
        const active = currentTime >= seg.timestamp && currentTime < (seg.timestamp + 30);
        return (
          <div
            key={seg.id}
            className={`flex gap-3 rounded-lg p-3 transition-colors cursor-pointer ${
              active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
            }`}
            onClick={() => onSeek(seg.timestamp)}
          >
            <span className="shrink-0 font-mono text-xs text-primary font-medium pt-0.5">
              {formatTimestamp(seg.timestamp)}
            </span>
            <p className="text-sm leading-relaxed">{seg.text}</p>
          </div>
        );
      })}
    </div>
  );
}
