import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted" role="status">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/20 bg-white/70 px-6 py-12 text-center">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
