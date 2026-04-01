export default function SuggestionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-20 w-36 bg-muted rounded-xl" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="h-10 w-72 bg-muted rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-56 bg-muted rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 w-14 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </div>
                <div className="h-3 w-40 bg-muted/60 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-muted/40 rounded" />
            <div className="h-3 w-3/4 bg-muted/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
