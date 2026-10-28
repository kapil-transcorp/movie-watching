import { NextRequest, NextResponse } from "next/server";
import { getTVSeasonDetails } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tvId = searchParams.get("tvId");
  const season = Number(searchParams.get("season") || "1");

  if (!tvId) {
    return NextResponse.json({ error: "Missing tvId" }, { status: 400 });
  }

  try {
    const data = await getTVSeasonDetails(tvId, season);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Season API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch season details", episodes: [] },
      { status: 500 }
    );
  }
}

