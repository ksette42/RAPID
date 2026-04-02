export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-28 bg-muted rounded-lg" />
        <div className="h-4 w-72 bg-muted/60 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
            <div className="h-5 w-5 rounded bg-muted" />
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
            <div className="space-y-1">
              <div className="h-5 w-36 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted/60 rounded" />
            </div>
            <div className="h-48 w-full bg-muted/20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
