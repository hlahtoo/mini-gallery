import { NextRequest, NextResponse } from "next/server";
import { galleryItems } from "@/data/gallery-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const sorted = [...galleryItems].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
  });

  const batch = sorted.slice(offset, offset + limit);

  return NextResponse.json({
    items: batch,
    nextOffset: offset + batch.length,
    hasMore: offset + batch.length < galleryItems.length,
  });
}
