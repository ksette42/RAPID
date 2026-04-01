export default function BillingLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-36 bg-muted rounded-lg" />
        <div className="h-4 w-64 bg-muted/60 rounded-lg" />
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-5 w-28 bg-muted rounded" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted/60 rounded" />
          </div>
          <div className="h-9 w-32 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-1">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-10 w-20 bg-muted rounded" />
              <div className="h-3 w-28 bg-muted/60 rounded" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-muted flex-shrink-0" />
                  <div className="h-3 w-full bg-muted/60 rounded" />
                </div>
              ))}
            </div>
            <div className="h-9 w-full bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
