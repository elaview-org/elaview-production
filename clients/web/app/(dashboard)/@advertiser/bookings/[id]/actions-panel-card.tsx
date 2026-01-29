import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";

interface ActionsPanelCardProps {
  status: string;
  bookingId: string;
  onApproveClick?: () => void;
  onDisputeClick?: () => void;
  onCancelClick?: () => void;
}

export function ActionsPanelCard({
  status,
  bookingId,
  onApproveClick,
  onDisputeClick,
  onCancelClick,
}: ActionsPanelCardProps) {
  const getNextActionHint = (status: string): string => {
    switch (status) {
      case "VERIFIED":
        return "Approve or Dispute";
      case "PAID":
        return "Waiting for file download";
      case "FILE_DOWNLOADED":
        return "Waiting for installation";
      case "INSTALLED":
        return "Waiting for verification";
      case "COMPLETED":
        return "Booking completed";
      case "DISPUTED":
        return "Dispute in progress";
      default:
        return "No action required";
    }
  };

  const canCancel = (status: string): boolean => {
    return ["PENDING_APPROVAL", "ACCEPTED", "PAID"].includes(status);
  };

  const showApproveDispute = status === "VERIFIED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Info */}
        <div className="space-y-1">
          <p className="text-sm">
            Status: <Badge variant="outline">{status}</Badge>
          </p>
          <p className="text-xs text-muted-foreground">
            Next: {getNextActionHint(status)}
          </p>
        </div>

        {/* Primary Actions */}
        {showApproveDispute && (
          <div className="space-y-2">
            <Button onClick={onApproveClick} className="w-full">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Installation
            </Button>
            <Button variant="outline" onClick={onDisputeClick} className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Open Dispute
            </Button>
          </div>
        )}

        {/* Secondary Actions */}
        <div className="border-t pt-3 space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href={`/messages/${bookingId}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Owner
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            View Receipt
          </Button>
          {canCancel(status) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onCancelClick}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
