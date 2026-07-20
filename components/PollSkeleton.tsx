export default function PollSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-6 w-2/3 animate-pulse rounded-md bg-zinc-200" />

      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-zinc-200 p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-9 w-full animate-pulse rounded-md bg-zinc-100" />
          <div className="mt-4 space-y-2">
            {[0, 1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-9 w-full animate-pulse rounded-md bg-zinc-100"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
