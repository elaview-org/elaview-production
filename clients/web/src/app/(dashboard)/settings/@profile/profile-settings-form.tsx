"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
import { Spinner } from "@/components/primitives/spinner";
import { updateProfileAction, updateAvatarAction } from "../settings.actions";
import { getInitials } from "@/lib/core/utils";
import env from "@/lib/core/env";
import { toast } from "sonner";

type Props = {
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
};

export default function ProfileSettingsForm({
  name,
  email,
  phone,
  avatar,
}: Props) {
  const prevSuccessRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadPending, startUploadTransition] = useTransition();
  const [state, action, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
    data: {
      name: name ?? "",
      email: email ?? "",
      phone: phone ?? "",
    },
  });

  useEffect(() => {
    if (state.success && !prevSuccessRef.current) {
      toast.success("Profile updated successfully");
    }
    prevSuccessRef.current = state.success;
  }, [state.success]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or GIF image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    startUploadTransition(async () => {
      try {
        const sigResponse = await fetch(
          `${env.client.apiUrl}/api/storage/upload-signature`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ folder: "avatars" }),
          }
        );

        if (!sigResponse.ok) {
          throw new Error("Failed to get upload signature");
        }

        const sig = await sigResponse.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", sig.signature);
        formData.append("timestamp", String(sig.timestamp));
        formData.append("api_key", sig.apiKey);
        if (sig.folder) formData.append("folder", sig.folder);
        if (sig.publicId) formData.append("public_id", sig.publicId);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        const result = await updateAvatarAction(uploadResult.secure_url);

        if (!result.success) {
          throw new Error(result.error ?? "Failed to save avatar");
        }

        toast.success("Photo updated");
        URL.revokeObjectURL(previewUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload photo"
        );
        setAvatarPreview(null);
        URL.revokeObjectURL(previewUrl);
      }
    });
  }

  return (
    <form action={action} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Profile Picture</FieldLabel>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage
                  src={avatarPreview ?? avatar ?? undefined}
                  alt={name ?? "User"}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(name ?? "")}
                </AvatarFallback>
              </Avatar>
              {uploadPending && (
                <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-full">
                  <Spinner className="size-6" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadPending ? "Uploading..." : "Change Photo"}
              </Button>
              <FieldDescription>
                JPG, PNG or GIF. Max size of 2MB
              </FieldDescription>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
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
