"use client";

import { useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import GalleryItem from "@/components/GalleryItem";
import { useGallery } from "@/context/GalleryContext";

export default function Home() {
  const { gallery, hasMore, loadMore } = useGallery();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const observeLastItem = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }

      loaderRef.current = node;
    },
    [hasMore, loadMore]
  );

  const breakpointColumnsObj = {
    default: 4,
    1024: 3,
    768: 2,
    640: 1,
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Gallery</h1>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="masonry-column"
      >
        {gallery.map((item, index) => {
          const isLastItem = index === gallery.length - 1;
          return (
            <div
              key={item.id}
              className="mb-4"
              ref={isLastItem ? observeLastItem : null}
            >
              <GalleryItem item={item} />
            </div>
          );
        })}
      </Masonry>

      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">End of gallery 🎉</p>
      )}
    </main>
  );
}
