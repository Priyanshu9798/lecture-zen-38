import type { SummarySection } from '@/types';

interface SummaryTabProps {
  sections: SummarySection[];
}

export default function SummaryTab({ sections }: SummaryTabProps) {
  return (
    <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
      {sections.map((section, i) => (
        <div key={i}>
          <h3 className="mb-2 text-lg font-semibold text-foreground">{section.heading}</h3>
          <ul className="space-y-1.5 pl-1">
            {section.points.map((point, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
