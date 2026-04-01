export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-28 bg-muted rounded-lg" />
        <div className="h-4 w-56 bg-muted/60 rounded-lg" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted/60 rounded" />
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-10 w-full bg-muted rounded-lg" />
          </div>
          <div className="h-9 w-28 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  );
}
