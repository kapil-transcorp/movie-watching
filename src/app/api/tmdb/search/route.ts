import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");

  if (!query.trim()) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMulti(query, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search TMDB", results: [] },
      { status: 500 }
    );
  }
}

