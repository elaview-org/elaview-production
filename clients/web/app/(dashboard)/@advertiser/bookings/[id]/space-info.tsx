import { Card, CardDescription, CardTitle } from "@/components/primitives/card";

function SpaceInfo() {
  // Dummy data for presentation; replace with real props/data as needed
  const billboard = {
    name: "Downtown Billboard",
    location: "123 Main St, Springfield",
    imageUrl:
      "/components/assets/images/still-b742de551ffe7ebf2eda37f96ab92d00.webp",
    size: "14 ft x 48 ft",
  };

  const campaign = {
    name: "Summer Sales Explosion",
    startDate: "2024-07-01",
    endDate: "2024-08-31",
  };

  return (
    <Card className="p-5">
      <CardTitle className="mb-2 text-lg">Space Information</CardTitle>
      <div className="mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-amber-100">
        <img
          src={billboard.imageUrl}
          alt={billboard.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mb-4">
        <CardTitle className="text-base">Billboard</CardTitle>
        <CardDescription>
          <span className="block font-medium">{billboard.name}</span>
          <span className="text-muted-foreground block text-sm">
            {billboard.location}
          </span>
          <span className="text-muted-foreground block text-sm">
            Size: {billboard.size}
          </span>
        </CardDescription>
      </div>
      <div className="mb-2">
        <CardTitle className="text-base">Campaign Information</CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-1">
            <span>
              <span className="font-medium">Campaign Name:</span>{" "}
              {campaign.name}
            </span>
            <span>
              <span className="font-medium">Start Date:</span>{" "}
              {new Date(campaign.startDate).toLocaleDateString()}
            </span>
            <span>
              <span className="font-medium">End Date:</span>{" "}
              {new Date(campaign.endDate).toLocaleDateString()}
            </span>
          </div>
        </CardDescription>
      </div>
    </Card>
  );
}

export default SpaceInfo;
