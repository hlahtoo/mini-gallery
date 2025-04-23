"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  item: {
    id: string;
    type: "image" | "video";
    thumbnailUrl: string;
    mediaUrl: string;
    prompt?: string;
  };
};

export default function GalleryItem({ item }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link href={`/${item.id}`} scroll={false}>
      {item.type === "image" ? (
        <div className="relative w-full break-inside-avoid">
          <Image
            src={item.thumbnailUrl}
            alt={item.prompt || "Gallery image"}
            width={500}
            height={300}
            layout="responsive"
            className="rounded-md shadow hover:brightness-90 transition"
          />
        </div>
      ) : (
        <div className="relative group w-full overflow-hidden rounded-md shadow break-inside-avoid">
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            playsInline
            loop
            className="w-full h-auto rounded-md group-hover:brightness-90 transition duration-300"
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => videoRef.current?.pause()}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="gray"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="gray"
              className="w-12 h-12 opacity-80 group-hover:opacity-0 transition duration-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.25v13.5L18.75 12 5.25 5.25z"
              />
            </svg>
          </div>
        </div>
      )}
    </Link>
  );
}
