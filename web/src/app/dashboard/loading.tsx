export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-64 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card/50 p-5 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="h-7 w-20 bg-muted rounded-lg" />
            <div className="h-4 w-32 bg-muted/60 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
              <div className="h-5 w-36 bg-muted rounded-lg" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted/60 rounded" />
                  </div>
                  <div className="h-5 w-20 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
              <div className="h-5 w-24 bg-muted rounded-lg" />
              <div className="h-2 w-full bg-muted rounded-full" />
              <div className="h-4 w-full bg-muted/60 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
