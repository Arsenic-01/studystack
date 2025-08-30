import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// The GET handler that will generate and return the image.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "StudyStack";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            fontFamily: '"DM Sans"',
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {/* Your Logo */}
            <img
              src="https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/logo.png"
              width="140"
              height="140"
              alt="StudyStack Logo"
              style={{ borderRadius: "16px" }}
            />
            {/* Title and Subtitle */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "700",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "400",
                  margin: 0,
                  color: "#9CA3AF",
                }}
              >
                K.K. Wagh Polytechnic, Nashik
              </p>
            </div>
          </div>
        </div>
      ),
      // ImageResponse options
      {
        // The standard 1.91:1 aspect ratio for social media banners.
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
