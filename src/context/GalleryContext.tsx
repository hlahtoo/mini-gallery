"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type GalleryItem = {
  id: string;
  type: "image" | "video";
  thumbnailUrl: string;
  mediaUrl: string;
  prompt: string;
  author: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  durationSec?: number;
};

type GalleryContextType = {
  gallery: GalleryItem[];
  hasMore: boolean;
  loadMore: () => void;
};

const GalleryContext = createContext<GalleryContextType | null>(null);

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context)
    throw new Error("useGallery must be used within GalleryProvider");
  return context;
}

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const BATCH_SIZE = 10;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/gallery?limit=${BATCH_SIZE}&offset=${offset}`
      );
      const { items, nextOffset, hasMore: more } = await res.json();
      setGallery((prev) => [...prev, ...items]);
      setOffset(nextOffset);
      setHasMore(more);
    } catch (e) {
      console.error("Error loading gallery batch", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  useEffect(() => {
    if (gallery.length === 0) {
      loadMore(); // initial load
    }
  }, [gallery.length, loadMore]);

  return (
    <GalleryContext.Provider value={{ gallery, hasMore, loadMore }}>
      {children}
    </GalleryContext.Provider>
  );
}
