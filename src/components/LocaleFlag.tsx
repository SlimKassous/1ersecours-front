import type { Locale } from "@/lib/i18n";

/** Drapeau CH (fr) et angleterre stylisée (en) — inspiré du style mini-drapeaux digikarte. */
export function LocaleFlag({
  code,
  className = "",
}: {
  code: Locale;
  className?: string;
}) {
  if (code === "fr") {
    return (
      <span
        className={`relative inline-flex h-3.5 w-5 items-center justify-center overflow-hidden rounded-[2px] bg-[#DA020E] shadow-sm ring-1 ring-neutral-800/60 ${className}`}
        aria-hidden
      >
        <span className="absolute h-[10px] w-[1.5px] bg-white" />
        <span className="absolute h-[1.5px] w-[10px] bg-white" />
      </span>
    );
  }
  return (
    <span
      className={`relative inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] bg-white shadow-sm ring-1 ring-neutral-800/60 ${className}`}
      aria-hidden
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#CE1124]" />
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#CE1124]" />
    </span>
  );
}
