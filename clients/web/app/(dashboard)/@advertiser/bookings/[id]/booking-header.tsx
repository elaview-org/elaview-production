import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent, CardHeader } from "@/components/primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { MessageSquare, X, MoreVertical } from "lucide-react";

interface BookingHeaderProps {
  bookingId: string;
  startDate: string;
  endDate: string;
  status: string;
  onMessageClick?: () => void;
  onCancelClick?: () => void;
}

export function BookingHeader({
  bookingId,
  startDate,
  endDate,
  status,
  onMessageClick,
  onCancelClick,
}: BookingHeaderProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "VERIFIED":
      case "COMPLETED":
        return "default";
      case "PAID":
      case "INSTALLED":
        return "secondary";
      case "DISPUTED":
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">
            Booking #{bookingId.slice(-8)}
          </h1>
          <p className="text-muted-foreground text-sm">
            {formatDateRange(startDate, endDate)}
          </p>
        </div>
        <Badge variant={getStatusVariant(status)}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onMessageClick} asChild>
            <Link href={`/messages/${bookingId}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Owner
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onCancelClick}>
            <X className="mr-2 h-4 w-4" />
            Cancel Booking
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Receipt</DropdownMenuItem>
              <DropdownMenuItem>Download Invoice</DropdownMenuItem>
              <DropdownMenuItem>Report Issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
