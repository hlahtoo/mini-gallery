import DetailClient from "@/components/DetailClient";

type Props = {
  params: { id: string };
};

export default function DetailPage({ params }: Props) {
  return <DetailClient id={params.id} />;
}
