export default function ImplementationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-muted rounded-lg" />
        <div className="h-4 w-80 bg-muted/60 rounded-lg" />
      </div>
      <div className="h-16 w-full bg-muted/30 rounded-xl border border-border/50" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 text-center space-y-2">
            <div className="h-8 w-12 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted/60 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-10 w-72 bg-muted rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 flex items-start gap-4">
            <div className="h-9 w-9 rounded-xl bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted/60 rounded" />
              <div className="h-3 w-64 bg-muted/40 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-7 w-20 bg-muted rounded-lg" />
              <div className="h-7 w-16 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
