"use client";

import { useEffect, useRef, useState } from "react";
import { useGallery } from "@/context/GalleryContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DetailClient({ id }: { id: string }) {
  const { gallery, loadMore } = useGallery();
  const asideRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const router = useRouter();

  const [activeId, setActiveId] = useState(id);
  const activeItem = gallery.find((item) => item.id === activeId);

  // Scroll-triggered infinite loading
  useEffect(() => {
    const lastItem = gallery[gallery.length - 1];
    const el = thumbnailRefs.current.get(lastItem?.id);
    if (!el || !asideRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root: asideRef.current, threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [gallery, loadMore]);

  // On initial mount, center the active thumbnail
  useEffect(() => {
    const el = thumbnailRefs.current.get(activeId);
    if (el && asideRef.current) {
      el.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [activeId]);

  // Detect scroll and update active media + route
  useEffect(() => {
    const container = asideRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerHeight = container.clientHeight;

      let closestId = activeId;
      let closestDist = Infinity;

      for (const [itemId, el] of thumbnailRefs.current.entries()) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const elCenterY = rect.top - containerRect.top + rect.height / 2;
        const dist = Math.abs(elCenterY - containerHeight / 2);

        if (dist < closestDist) {
          closestDist = dist;
          closestId = itemId;
        }
      }

      if (closestId !== activeId) {
        setActiveId(closestId);
        router.replace(`/${closestId}`);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [gallery, activeId, router]);

  if (!activeItem) {
    return (
      <main className="flex w-full h-screen items-center justify-center text-gray-500">
        Loading or not found...
      </main>
    );
  }

  return (
    <main className="flex w-full h-screen overflow-hidden">
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 bg-white px-3 py-1 rounded shadow text-sm text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to Gallery
      </Link>
      {/* Column 1: Main viewer */}
      <div className="flex-[3] flex justify-center items-center bg-black overflow-hidden">
        {activeItem.type === "image" ? (
          <Image
            src={activeItem.mediaUrl}
            alt={activeItem.prompt || "Gallery image"}
            width={1000}
            height={1000}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            src={activeItem.mediaUrl}
            controls
            className="max-w-full max-h-full rounded-lg"
          />
        )}
      </div>

      {/* Column 2: Metadata */}
      <div className="flex-[1] p-6 flex flex-col gap-4 bg-white border-l overflow-y-auto">
        <div>
          <p className="text-sm text-gray-600">
            {new Date(activeItem.uploadedAt).toDateString()}
          </p>
          <h2 className="text-lg font-semibold text-gray-700">
            {activeItem.author}
          </h2>
        </div>
        <p className="text-md text-gray-500">{activeItem.prompt}</p>
        <div className="flex flex-wrap gap-2">
          {activeItem.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            console.log(`Incrementing like for item: ${activeItem.id}`);
          }}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          ❤️ Like ({activeItem.likes})
        </button>
      </div>

      {/* Column 3: Scrollable sidebar */}
      <aside
        ref={asideRef}
        className="w-[80px] overflow-y-scroll scrollbar-hide bg-gray-50 border-l p-2 space-y-2"
      >
        {/* Top ghost spacer */}
        <div style={{ height: "45vh" }} />
        {gallery.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) thumbnailRefs.current.set(item.id, el);
              }}
            >
              <Link
                href={`/${item.id}`}
                scroll={false}
                className={`block border-2 transition duration-150 ${
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50 scale-105"
                    : "border-transparent hover:border-gray-300"
                } rounded overflow-hidden`}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    width={64}
                    height={64}
                    className="w-[64px] h-[64px] object-cover"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    muted
                    className="w-[64px] h-[64px] object-cover"
                  />
                )}
              </Link>
            </div>
          );
        })}
        {/* Bottom ghost spacer */}
        <div style={{ height: "45vh" }} />
      </aside>
    </main>
  );
}
