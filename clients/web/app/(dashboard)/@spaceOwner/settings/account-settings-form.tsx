"use client";

import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Separator } from "@/components/primitives/separator";
import type { SpaceOwnerSettingsQuery } from "@/types/gql/graphql";

type Props = {
  user: NonNullable<SpaceOwnerSettingsQuery["me"]>;
};

function formatDate(dateString: string | null | undefined | unknown) {
  if (!dateString) return "Never";
  return new Date(dateString as string).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AccountSettingsForm({ user }: Props) {
  return (
    <div className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Account Information</FieldLabel>
          <div className="space-y-3 rounded-md border p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Account Created
              </span>
              <span className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Last Login</span>
              <span className="text-sm font-medium">
                {formatDate(user.lastLoginAt)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Account Type
              </span>
              <span className="text-sm font-medium capitalize">
                {user.activeProfileType?.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        </Field>

        <Field>
          <FieldLabel>Change Password</FieldLabel>
          <FieldDescription>
            Update your password to keep your account secure.
          </FieldDescription>
          <div className="mt-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                disabled
              />
            </Field>
            <Button type="button" variant="outline" disabled>
              Change Password
            </Button>
            <FieldDescription>
              Password change functionality coming soon.
            </FieldDescription>
          </div>
        </Field>

        <Separator className="my-6" />

        <Field>
          <FieldLabel className="text-destructive">Danger Zone</FieldLabel>
          <FieldDescription>
            Irreversible and destructive actions
          </FieldDescription>
          <div className="mt-4 space-y-4">
            <div className="border-destructive/50 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button type="button" variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
            <FieldDescription>
              Account deletion coming soon. Contact support if needed.
            </FieldDescription>
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}
