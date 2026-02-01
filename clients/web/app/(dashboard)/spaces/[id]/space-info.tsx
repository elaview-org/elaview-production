import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { formatDate } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const SpaceInfo_SpaceFragment = graphql(`
  fragment SpaceInfo_SpaceFragment on Space {
    description
    address
    city
    state
    zipCode
    width
    height
    dimensionsText
    traffic
    availableFrom
    availableTo
    averageRating
    totalBookings
  }
`);

type Props = {
  data: FragmentType<typeof SpaceInfo_SpaceFragment>;
};

export default function SpaceInfo({ data }: Props) {
  const space = getFragmentData(SpaceInfo_SpaceFragment, data);

  return (
    <Card>
      {space.description && (
        <>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {space.description}
            </p>
          </CardContent>
          <Separator />
        </>
      )}

      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{space.address}</p>
        <p className="text-muted-foreground text-sm">
          {space.city}, {space.state} {space.zipCode}
        </p>
      </CardContent>
      <Separator />

      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {space.dimensionsText && (
            <DetailItem label="Dimensions" value={space.dimensionsText} />
          )}
          {space.width && space.height && !space.dimensionsText && (
            <DetailItem
              label="Dimensions"
              value={`${space.width}" x ${space.height}"`}
            />
          )}
          {space.traffic && (
            <DetailItem label="Foot Traffic" value={space.traffic} />
          )}
          <DetailItem
            label="Total Bookings"
            value={String(space.totalBookings)}
          />
          <DetailItem
            label="Average Rating"
            value={
              space.averageRating
                ? `${space.averageRating.toFixed(1)} / 5`
                : "No ratings"
            }
          />
        </div>
      </CardContent>

      {(space.availableFrom || space.availableTo) && (
        <>
          <Separator />
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {space.availableFrom && (
                <DetailItem
                  label="Available From"
                  value={formatDate(space.availableFrom)}
                />
              )}
              {space.availableTo && (
                <DetailItem
                  label="Available Until"
                  value={formatDate(space.availableTo)}
                />
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
