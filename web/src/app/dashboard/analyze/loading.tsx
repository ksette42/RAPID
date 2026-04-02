export default function AnalyzeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-28 bg-muted rounded-lg" />
        <div className="h-4 w-80 bg-muted/60 rounded-lg" />
      </div>
      <div className="h-10 w-80 bg-muted rounded-lg" />
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-5 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted/50 border border-border/50" />
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-5 w-32 bg-muted rounded-lg" />
        <div className="h-10 w-full bg-muted rounded-lg" />
        <div className="h-48 w-full bg-muted/30 rounded-xl border-2 border-dashed border-border" />
        <div className="h-52 w-full bg-muted/20 rounded-lg" />
        <div className="h-12 w-full bg-muted rounded-lg" />
      </div>
    </div>
  );
}
