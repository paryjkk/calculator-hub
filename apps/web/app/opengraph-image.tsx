import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Calculator Hub";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17181c",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="#fff" strokeWidth="2.5" fill="none" />
            <rect x="8" y="7.5" width="16" height="5.5" rx="1.75" fill="#4c66ff" />
            <circle cx="11" cy="19.5" r="2.4" fill="#fff" />
            <circle cx="21" cy="19.5" r="2.4" fill="#fff" />
            <circle cx="11" cy="25.5" r="2.4" fill="#fff" />
            <circle cx="21" cy="25.5" r="2.4" fill="#4c66ff" />
          </svg>
          <div style={{ color: "#fff", fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
            Calculator Hub
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#fff", fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>
            Every calculator you need.
          </div>
          <div style={{ color: "#9aa0ab", fontSize: 40, fontWeight: 500, marginTop: 10 }}>
            Nothing you don&apos;t.
          </div>
        </div>
        <div style={{ color: "#6b707a", fontSize: 26 }}>
          54 free calculators · Finance · Health · Math · Conversions
        </div>
      </div>
    ),
    size
  );
}
