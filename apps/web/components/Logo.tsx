export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="8" y="7.5" width="16" height="5.5" rx="1.75" fill="var(--accent)" />
      <circle cx="11" cy="19.5" r="2.4" fill="var(--ink)" />
      <circle cx="21" cy="19.5" r="2.4" fill="var(--ink)" />
      <circle cx="11" cy="25.5" r="2.4" fill="var(--ink)" />
      <circle cx="21" cy="25.5" r="2.4" fill="var(--accent)" />
    </svg>
  );
}
