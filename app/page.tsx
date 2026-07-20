import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
        Prototype
      </span>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        AI Poll Generator
      </h1>
      <p className="mt-3 max-w-lg text-sm text-zinc-600 sm:text-base">
        Generate LMS polls from learning content or a topic with AI, review and
        edit the result, then publish — all in one streamlined workflow.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/generate"
          className="group rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" />
              <path d="M19 15l.9 2.6L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.4L19 15z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold tracking-tight text-zinc-900">
            Generate Poll
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create a new poll from a course, file, video, or topic.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 transition-all group-hover:gap-2">
            Get started
            <span aria-hidden>→</span>
          </span>
        </Link>

        <Link
          href="/polls"
          className="group rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18" />
              <path d="M7 14h4" />
              <path d="M7 17h7" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold tracking-tight text-zinc-900">
            Poll Manager
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            View, edit, and review results for all your polls.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 transition-all group-hover:gap-2">
            Open manager
            <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </main>
  );
}
