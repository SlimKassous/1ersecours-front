import type { BootstrapAddress } from "@/lib/siteBootstrap";

function IconLocationHub({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18" />
      <path d="M9 22v-4h6v4" />
      <path d="M9 10h.01M12 10h.01M15 10h.01M9 14h6" />
    </svg>
  );
}

function IconTransit({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 6v11a1 1 0 001 1h6a1 1 0 001-1V6" />
      <path d="M6 6h12a2 2 0 012 2v2H4V8a2 2 0 012-2z" />
      <circle cx="9" cy="16" r="1" />
      <circle cx="15" cy="16" r="1" />
      <path d="M8 10h8" />
    </svg>
  );
}

type Props = {
  addresses: BootstrapAddress[];
  mapLinkLabel: string;
  transportLabel: string;
};

export function AddressLocationCards({ addresses, mapLinkLabel, transportLabel }: Props) {
  if (addresses.length === 0) return null;

  return (
    <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
      {addresses.map((a) => (
        <li
          key={a.id}
          className="flex h-full flex-col rounded-2xl border border-rose-100 bg-white p-5 shadow-[0_12px_40px_rgba(244,63,94,0.12)] ring-1 ring-rose-50/80 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b827ce] via-[#e11d48] to-[#ff6b9d] shadow-lg shadow-rose-400/35 ring-2 ring-white/50"
              aria-hidden
            >
              <IconLocationHub className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-lg font-bold leading-tight text-neutral-950">{a.ville}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e11d48]">
                {a.service}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3.5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md shadow-indigo-500/25 ring-1 ring-white/40"
              aria-hidden
            >
              <IconBuilding className="h-5 w-5 text-white" />
            </div>
            <p className="min-w-0 flex-1 pt-1.5 text-sm font-semibold leading-relaxed text-neutral-800">
              {a.rue}
            </p>
          </div>

          <div className="mt-5 flex flex-1 flex-col border-t border-rose-100/80 pt-5">
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30 ring-1 ring-white/40"
                aria-hidden
              >
                <IconTransit className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800/85">
                  {transportLabel}
                </p>
                <p className="fa-display mt-2 whitespace-pre-line text-xs font-semibold leading-relaxed text-neutral-800 sm:text-sm">
                  {a.transport}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 shrink-0 border-t border-rose-100/90 pt-6">
            <a
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(`${a.rue} ${a.ville}`)
              }
              target="_blank"
              rel="noopener noreferrer"
              className="fa-btn-primary inline-flex w-full min-h-[48px] items-center justify-center rounded-full px-4 py-3 text-center text-sm font-bold touch-manipulation"
            >
              {mapLinkLabel}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
