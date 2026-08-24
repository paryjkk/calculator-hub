"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** AdSense ad-unit id; empty until approved. */
  slotId?: string;
  className?: string;
}

/**
 * One of the two ad slots per calculator page (baseline requirement).
 * Renders a neutral placeholder until NEXT_PUBLIC_ADSENSE_CLIENT and a
 * slot id are configured — never an empty box in production.
 */
export default function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (client && slotId && !pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      } catch {
        /* script blocked */
      }
    }
  }, [client, slotId]);

  if (!client || !slotId) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100/70 text-xs text-slate-400 ${className}`}
      >
        Advertisement
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
