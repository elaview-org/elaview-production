import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  DollarSign,
  Camera,
  CheckCircle2,
  FileDown,
  UserCheck,
  Clock,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "payment" | "verification" | "status_change" | "file_download" | "approval";
  title: string;
  description?: string;
  createdAt: string;
  status?: string;
  user?: {
    avatarUrl?: string | null;
    firstName: string;
    lastName: string;
  };
}

interface ActivityTimelineCardProps {
  events?: TimelineEvent[];
}

export function ActivityTimelineCard({ events = [] }: ActivityTimelineCardProps) {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "payment":
        return DollarSign;
      case "verification":
        return Camera;
      case "file_download":
        return FileDown;
      case "approval":
        return UserCheck;
      case "status_change":
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activity yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, idx) => {
            const Icon = getEventIcon(event.type);
            return (
              <div key={event.id}>
                <div className="flex gap-4">
                  {/* Icon/Avatar */}
                  <div className="flex-shrink-0">
                    {event.user ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={event.user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {event.user.firstName[0]}
                          {event.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{event.title}</p>
                      {event.status && (
                        <Badge variant="outline" className="text-xs">
                          {event.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {idx < events.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
