import DetailClientWrapper from "@/components/DetailClientWrapper";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailClientWrapper id={id} />;
}
