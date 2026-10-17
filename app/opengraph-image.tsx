import { ImageResponse } from "next/og";

export const alt = "Second Tour — Le rappel qui fait revenir tes clients au garage, tout seul.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1b3faf",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#f6f1e7",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>
          <span>SECOND</span>
          <span style={{ color: "#ffb21a", marginLeft: 12 }}>TOUR</span>
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, marginTop: 30 }}>
          Le rappel qui fait revenir tes clients au garage,
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 72,
            fontWeight: 900,
          }}
        >
          <span style={{ background: "#ffb21a", color: "#0e1a33", padding: "0 14px" }}>
            tout seul.
          </span>
        </div>
      </div>
    ),
    size
  );
}
