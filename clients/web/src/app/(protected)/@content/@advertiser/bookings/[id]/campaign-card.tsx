import Image from "next/image";
import { IconUser } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { getInitials } from "@/lib/core/utils";

type Props = {
  campaign?: {
    id: unknown;
    name: string;
    imageUrl: string;
  } | null;
  booking: {
    advertiserNotes?: string | null;
    space?: {
      owner?: {
        businessName?: string | null;
        user?: {
          name: string;
          avatar?: string | null;
        } | null;
      } | null;
    } | null;
  };
};

export default function CampaignCard({ campaign, booking }: Props) {
  if (!campaign) return null;

  const owner = booking.space?.owner;
  const user = owner?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={campaign.imageUrl}
              alt={campaign.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">{campaign.name}</h3>
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? (
                    getInitials(user.name)
                  ) : (
                    <IconUser className="size-3" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">
                {owner?.businessName ?? "Unknown Owner"}
              </span>
            </div>
          </div>
        </div>

        {booking.advertiserNotes && (
          <div className="border-t pt-4">
            <h4 className="mb-2 text-sm font-medium">Your Notes</h4>
            <p className="text-muted-foreground text-sm">
              {booking.advertiserNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
