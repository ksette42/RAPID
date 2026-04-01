export default function ApiKeysLoading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-9 w-24 bg-muted rounded-lg" />
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-5 w-28 bg-muted rounded" />
        <div className="h-3 w-64 bg-muted/60 rounded" />
        <div className="divide-y divide-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-4 first:pt-0 flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-5 w-12 bg-muted rounded-full" />
                </div>
                <div className="h-3 w-64 bg-muted/60 rounded font-mono" />
                <div className="h-3 w-40 bg-muted/40 rounded" />
              </div>
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
