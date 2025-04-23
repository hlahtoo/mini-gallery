"use client";

import DetailClient from "./DetailClient";

export default function DetailClientWrapper({ id }: { id: string }) {
  return <DetailClient id={id} />;
}
