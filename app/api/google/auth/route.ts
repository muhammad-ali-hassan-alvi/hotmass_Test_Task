// import { type NextRequest, NextResponse } from "next/server";
// import { google } from "googleapis";

// export async function GET(request: NextRequest) {
//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URI
//     );

//     const scopes = [
//       "https://www.googleapis.com/auth/spreadsheets",
//       "https://www.googleapis.com/auth/drive.readonly",
//     ];

//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: scopes,
//       prompt: "consent",
//     });

//     return NextResponse.json({ authUrl });
//   } catch (error) {
//     console.error("Google auth error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate auth URL" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Auth route hit!");
    console.log("Environment variables:");
    console.log(
      "GOOGLE_CLIENT_ID:",
      process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set"
    );
    console.log(
      "GOOGLE_CLIENT_SECRET:",
      process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set"
    );
    console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Google OAuth not configured" },
        { status: 500 }
      );
    }

    // Simple auth URL for testing
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI!)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(
        "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly"
      )}&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log("Generated auth URL:", authUrl);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
