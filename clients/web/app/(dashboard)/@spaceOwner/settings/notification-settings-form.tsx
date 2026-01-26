"use client";

import { Checkbox } from "@/components/primitives/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/primitives/field";
import { Button } from "@/components/primitives/button";
import {
  NotificationType,
  type SpaceOwnerSettingsQuery,
} from "@/types/gql/graphql";
import { NOTIFICATION_LABELS, SPACE_OWNER_NOTIFICATIONS } from "./constants";

type Props = {
  preferences: SpaceOwnerSettingsQuery["myNotificationPreferences"];
};

export default function NotificationSettingsForm({ preferences }: Props) {
  const getPreference = (type: NotificationType) =>
    preferences.find((p) => p.notificationType === type);

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
              {SPACE_OWNER_NOTIFICATIONS.map((type) => {
                const pref = getPreference(type);
                const label = NOTIFICATION_LABELS[type] ?? type;

                return (
                  <tr key={type} className="border-b last:border-0">
                    <td className="py-3 text-sm">{label}</td>
                    <td className="py-3 text-center">
                      <Checkbox
                        defaultChecked={pref?.inAppEnabled ?? true}
                        disabled
                      />
                    </td>
                    <td className="py-3 text-center">
                      <Checkbox
                        defaultChecked={pref?.emailEnabled ?? true}
                        disabled
                      />
                    </td>
                    <td className="py-3 text-center">
                      <Checkbox
                        defaultChecked={pref?.pushEnabled ?? false}
                        disabled
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Field>
          <Button type="button" disabled>
            Save Preferences
          </Button>
          <FieldDescription>
            Notification preferences management coming soon.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}