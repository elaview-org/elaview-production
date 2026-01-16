"use client";

import { Button } from "@/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/field";
import { Input } from "@/components/input";
import type { User } from "@/types/graphql.generated";
import { Separator } from "@/components/separator";

interface AccountSettingsFormProps {
  user: NonNullable<Query["currentUser"]>;
}

type Query = {
  currentUser: User | null;
};

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <FieldGroup>
        {/* Account Information */}
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

        {/* Password Change Section */}
        <Field>
          <FieldLabel>Change Password</FieldLabel>
          <FieldDescription>
            Update your password to keep your account secure. Make sure it's at
            least 8 characters long.
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
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
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

        {/* Danger Zone */}
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
                    This action cannot be undone.
                  </p>
                </div>
                <Button type="button" variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
            <FieldDescription>
              Account deletion functionality coming soon. Please contact support
              if you need to delete your account.
            </FieldDescription>
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}
