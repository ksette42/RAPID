export default function DocumentationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-9 w-36 bg-muted rounded-lg" />
      </div>
      <div className="h-10 w-full bg-muted rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-2/3 bg-muted/40 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-muted/60 rounded" />
              <div className="flex gap-1">
                <div className="h-7 w-7 bg-muted rounded" />
                <div className="h-7 w-7 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
