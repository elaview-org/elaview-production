"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { updateProfileAction } from "./settings.actions";
import type { AdvertiserSettingsQuery } from "@/types/gql/graphql";
import { toast } from "sonner";

type Props = {
  user: NonNullable<AdvertiserSettingsQuery["me"]>;
};

export default function ProfileSettingsForm({ user }: Props) {
  const prevSuccessRef = useRef(false);
  const [state, action, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
    data: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    },
  });

  useEffect(() => {
    if (state.success && !prevSuccessRef.current) {
      toast.success("Profile updated successfully");
    }
    prevSuccessRef.current = state.success;
  }, [state.success]);

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <form action={action} className="space-y-6">
      <FieldGroup>
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
              <Button type="button" variant="outline" size="sm" disabled>
                Change Photo
              </Button>
              <FieldDescription>
                JPG, PNG or GIF. Max size of 2MB
              </FieldDescription>
            </div>
          </div>
        </Field>

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
            This is your display name visible to space owners.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={state.data.email}
            disabled
          />
          <FieldDescription>
            Your email is used for login and cannot be changed here.
          </FieldDescription>
        </Field>

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
            Optional. Used for important booking notifications via SMS.
          </FieldDescription>
        </Field>

        {state.message && !state.success && (
          <Field>
            <p className="text-destructive text-sm" aria-live="polite">
              {state.message}
            </p>
          </Field>
        )}

        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
