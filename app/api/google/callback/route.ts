import { type NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(
        new URL("/dashboard?error=oauth_error", request.url)
      );
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/dashboard?error=no_code", request.url)
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      console.error("No access token received");
      return NextResponse.redirect(
        new URL("/dashboard?error=no_token", request.url)
      );
    }

    // Store tokens in cookies
    const cookieStore = await cookies();

    cookieStore.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      sameSite: "lax",
      path: "/",
    });

    if (tokens.refresh_token) {
      cookieStore.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 3600, // 30 days
        sameSite: "lax",
        path: "/",
      });
    }

    console.log("Google OAuth successful, tokens stored");
    return NextResponse.redirect(
      new URL("/dashboard?connected=google", request.url)
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=auth_failed", request.url)
    );
  }
}
