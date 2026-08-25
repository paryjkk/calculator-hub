import type { CategoryId } from "@calc/shared";

interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CategoryIcon({
  category,
  className = "",
}: IconProps & { category: CategoryId }) {
  switch (category) {
    case "financial":
      return <BankIcon className={className} />;
    case "health":
      return <PulseIcon className={className} />;
    case "math":
      return <SigmaIcon className={className} />;
    case "conversion":
      return <ArrowsIcon className={className} />;
    case "datetime":
      return <CalendarIcon className={className} />;
    case "utilities":
      return <ToolsIcon className={className} />;
  }
}

export function BankIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8m4.7-8v8m4.6-8v8M19 10v8" />
      <path d="M3 20.5h18" />
    </svg>
  );
}

export function PulseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 12h4l2.5-6 4.5 12L16.5 12H21" />
    </svg>
  );
}

export function SigmaIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M17 5H7l5.5 7L7 19h10" />
    </svg>
  );
}

export function ArrowsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 8h13m0 0-3.2-3.2M17 8l-3.2 3.2" />
      <path d="M20 16H7m0 0 3.2-3.2M7 16l3.2 3.2" />
    </svg>
  );
}

export function CalendarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10.5h16M8.5 3.5v4m7-4v4" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ToolsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M14.5 6.5a3.5 3.5 0 0 1 4.9-3.2l-2.6 2.6 1.3 1.3 2.6-2.6a3.5 3.5 0 0 1-4.6 4.4L7 18.1a2 2 0 1 1-2.8-2.8l9.1-9.1Z" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m5 13 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function UserIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.4 3.6-5 7-5s6.2 1.6 7 5" />
    </svg>
  );
}

export function MailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function ShieldIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3.5 19 6v6c0 4.4-3 7.4-7 8.5C8 19.4 5 16.4 5 12V6l7-2.5Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}
