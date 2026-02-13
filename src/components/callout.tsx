import { Lightbulb, Info, AlertTriangle, StickyNote } from 'lucide-react';
import type { ReactNode } from 'react';

const calloutConfig = {
  tip:     { icon: Lightbulb,     border: 'border-emerald-500', bg: 'bg-emerald-500/5' },
  info:    { icon: Info,          border: 'border-blue-500',    bg: 'bg-blue-500/5' },
  warning: { icon: AlertTriangle, border: 'border-amber-500',   bg: 'bg-amber-500/5' },
  note:    { icon: StickyNote,    border: 'border-slate-400',   bg: 'bg-slate-500/5' },
} as const;

export function Callout({ type = 'note', title, children }: { type?: keyof typeof calloutConfig; title?: string; children: ReactNode }) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  return (
    <div className={`my-4 rounded-lg border-l-4 ${config.border} ${config.bg} p-4`}>
      <div className="flex items-center gap-2 font-semibold mb-1">
        <Icon className="w-4 h-4" />
        {title || type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
