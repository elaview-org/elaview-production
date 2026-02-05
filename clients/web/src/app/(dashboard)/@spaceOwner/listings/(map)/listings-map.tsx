import MaybePlaceholder from "@/components/status/maybe-placeholder";
import MapPlaceholder from "./placeholder";

type Props = {
  data: unknown[];
};

export default function ListingsMap({ data }: Props) {
  return (
    <MaybePlaceholder data={data} placeholder={<MapPlaceholder />}>
      <div className="flex h-150 items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">
          Map view requires location data (coming soon)
        </p>
      </div>
    </MaybePlaceholder>
  );
}
