"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/field";
import { Input } from "@/components/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { updateProfileAction } from "./settings.actions";
import type { User } from "@/types/graphql.generated";
import { toast } from "sonner";

interface ProfileSettingsFormProps {
  user: User;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [state, action, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
    data: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    },
  });

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  if (state.success) {
    toast.success("Profile updated successfully");
  }

  return (
    <form action={action} className="space-y-6">
      <FieldGroup>
        {/* Avatar Section */}
        <Field>
          <FieldLabel>Profile Picture</FieldLabel>
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage
                src={user.avatar ?? undefined}
                alt={user.name ?? "User"}
              />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" size="sm">
                Change Photo
              </Button>
              <FieldDescription>
                JPG, PNG or GIF. Max size of 2MB
              </FieldDescription>
            </div>
          </div>
        </Field>

        {/* Name Field */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            defaultValue={state.data.name}
            required
          />
          <FieldDescription>
            This is your display name. It will be visible to space owners.
          </FieldDescription>
        </Field>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={state.data.email}
            required
          />
          <FieldDescription>
            We&#39;ll use this email to send you booking updates and
            notifications.
          </FieldDescription>
        </Field>

        {/* Phone Field */}
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            defaultValue={state.data.phone ?? ""}
          />
          <FieldDescription>
            Optional. Used for important account notifications via SMS.
          </FieldDescription>
        </Field>

        {/* Error/Success Message */}
        {state.message && (
          <Field>
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-destructive"
              }`}
              aria-live="polite"
            >
              {state.message}
            </p>
          </Field>
        )}

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
