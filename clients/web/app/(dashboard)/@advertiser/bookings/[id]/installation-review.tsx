import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { CheckCircle2, AlertCircle, Download, Maximize2 } from "lucide-react";
import Image from "next/image";

interface InstallationReviewsProps {
  verification?: {
    photos?: Array<{ url: string; id: string }>;
    uploadedAt?: string | null;
    gpsVerified?: boolean;
  };
}

export default function InstallationReviews({
  verification,
}: InstallationReviewsProps) {
  const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return "Not uploaded";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const photos = verification?.photos || [];

  if (photos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Installation Review</CardTitle>
          <CardDescription>Owner&apos;s Verification Photos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Verification photos not yet uploaded
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Installation Review</CardTitle>
        <CardDescription>Owner&apos;s Verification Photos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => {
                // TODO: Open full-size photo viewer
                window.open(photo.url, "_blank");
              }}
              className="group bg-muted relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={photo.url}
                alt={`Verification photo ${idx + 1}`}
                className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <Maximize2 className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-sm">
          {verification?.uploadedAt && (
            <p className="text-muted-foreground">
              Uploaded: {formatDateTime(verification.uploadedAt)}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Badge
              variant={verification?.gpsVerified ? "default" : "outline"}
              className="gap-1"
            >
              {verification?.gpsVerified ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  GPS Verified
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  GPS Not Verified
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Maximize2 className="mr-2 h-4 w-4" />
            View Full Size
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
