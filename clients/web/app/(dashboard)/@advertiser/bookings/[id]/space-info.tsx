import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/card";

function SpaceInfo() {
  // Dummy data for presentation; replace with real props/data as needed
  const billboard = {
    name: "Downtown Billboard",
    location: "123 Main St, Springfield",
    imageUrl:
      "https://images.unsplash.com/photo-1511974035430-5de47d3b95da?auto=format&fit=crop&w=800&q=80",
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
      <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-amber-100 flex items-center justify-center">
        <img
          src={billboard.imageUrl}
          alt={billboard.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="mb-4">
        <CardTitle className="text-base">Billboard</CardTitle>
        <CardDescription>
          <span className="block font-medium">{billboard.name}</span>
          <span className="block text-sm text-muted-foreground">
            {billboard.location}
          </span>
          <span className="block text-sm text-muted-foreground">
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
