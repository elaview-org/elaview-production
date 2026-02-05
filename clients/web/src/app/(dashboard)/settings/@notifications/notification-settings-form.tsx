"use client";

import { useOptimistic, useTransition } from "react";
import { Checkbox } from "@/components/primitives/checkbox";
import { FieldGroup } from "@/components/primitives/field";
import { NotificationType } from "@/types/gql/graphql";
import { updateNotificationPreferenceAction } from "../settings.actions";
import { cn } from "@/lib/utils";

type NotificationPreference = {
  id: string;
  notificationType: NotificationType;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
};

type Channel = "inAppEnabled" | "emailEnabled" | "pushEnabled";

type Props = {
  preferences: readonly NotificationPreference[];
  notificationTypes: readonly NotificationType[];
  notificationLabels: Partial<Record<NotificationType, string>>;
};

export default function NotificationSettingsForm({
  preferences,
  notificationTypes,
  notificationLabels,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [optimisticPrefs, updateOptimisticPrefs] = useOptimistic(preferences);

  const getPreference = (type: NotificationType) =>
    optimisticPrefs.find((p) => p.notificationType === type);

  function handleToggle(
    type: NotificationType,
    channel: Channel,
    enabled: boolean
  ) {
    startTransition(async () => {
      updateOptimisticPrefs((prev) =>
        prev.map((p) =>
          p.notificationType === type ? { ...p, [channel]: enabled } : p
        )
      );
      await updateNotificationPreferenceAction(type, channel, enabled);
    });
  }

  return (
    <div className="space-y-6">
      <FieldGroup>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-muted-foreground pb-3 text-left text-sm font-medium">
                  Notification Type
                </th>
                <th className="text-muted-foreground pb-3 text-center text-sm font-medium">
                  In-App
                </th>
                <th className="text-muted-foreground pb-3 text-center text-sm font-medium">
                  Email
                </th>
                <th className="text-muted-foreground pb-3 text-center text-sm font-medium">
                  Push
                </th>
              </tr>
            </thead>
            <tbody>
              {notificationTypes.map((type) => {
                const pref = getPreference(type);
                const label = notificationLabels[type] ?? type;

                return (
                  <tr
                    key={type}
                    className={cn(
                      "border-b last:border-0",
                      pending && "opacity-60"
                    )}
                  >
                    <td className="py-3 text-sm">{label}</td>
                    <td className="py-3 text-center">
                      <Checkbox
                        checked={pref?.inAppEnabled ?? true}
                        onCheckedChange={(checked) =>
                          handleToggle(type, "inAppEnabled", !!checked)
                        }
                      />
                    </td>
                    <td className="py-3 text-center">
                      <Checkbox
                        checked={pref?.emailEnabled ?? true}
                        onCheckedChange={(checked) =>
                          handleToggle(type, "emailEnabled", !!checked)
                        }
                      />
                    </td>
                    <td className="py-3 text-center">
                      <Checkbox
                        checked={pref?.pushEnabled ?? false}
                        onCheckedChange={(checked) =>
                          handleToggle(type, "pushEnabled", !!checked)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FieldGroup>
    </div>
  );
}
