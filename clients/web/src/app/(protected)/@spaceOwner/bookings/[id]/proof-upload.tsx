"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { IconLoader2, IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Button } from "@/components/primitives/button";
import env from "@/lib/core/env";
import { submitProofAction } from "../bookings.actions";

type Props = {
  bookingId: string;
};

export default function ProofUpload({ bookingId }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= 10) break;

      try {
        const url = await uploadImage(file, `bookings/${bookingId}/proof`);
        newPhotos.push(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      }
    }

    setPhotos(newPhotos);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (photos.length === 0) {
      toast.error("Please upload at least one verification photo");
      return;
    }

    startTransition(async () => {
      const result = await submitProofAction(bookingId, photos);
      if (result.success) {
        toast.success("Verification photos submitted successfully");
      } else {
        toast.error(result.error ?? "Failed to submit verification photos");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Verification Photos</CardTitle>
        <CardDescription>
          Upload photos showing the advertisement installed at your space. These
          will be sent to the advertiser for approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {photos.length === 0 ? (
          <button
            type="button"
            disabled={uploading || pending}
            onClick={() => inputRef.current?.click()}
            className="bg-muted hover:border-primary hover:text-primary flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <IconLoader2 className="size-8 animate-spin" />
            ) : (
              <IconPhoto className="size-8" />
            )}
            <span>{uploading ? "Uploading..." : "Add Photos"}</span>
            <span className="text-muted-foreground text-xs">
              Upload up to 10 photos
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={photo}
                    alt={`Verification photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  >
                    <IconX className="size-4 text-white" />
                  </button>
                </div>
              ))}

              {photos.length < 10 && (
                <button
                  type="button"
                  disabled={uploading || pending}
                  onClick={() => inputRef.current?.click()}
                  className="text-muted-foreground hover:border-primary hover:text-primary flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <IconLoader2 className="size-6 animate-spin" />
                  ) : (
                    <IconPlus className="size-6" />
                  )}
                </button>
              )}
            </div>

            <Button onClick={handleSubmit} disabled={pending || uploading}>
              {pending && <IconLoader2 className="size-4 animate-spin" />}
              Submit for Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const sigResponse = await fetch(
    `${env.client.apiUrl}/api/storage/upload-signature`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ folder }),
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

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const result = await uploadResponse.json();
  return result.secure_url;
}
