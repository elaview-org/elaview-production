"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconLoader2, IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { updateSpaceImagesAction } from "../listings.actions";
import { toast } from "sonner";
import env from "@/lib/core/env";

export const Gallery_SpaceFragment = graphql(`
  fragment Gallery_SpaceFragment on Space {
    id
    title
    images
  }
`);

type Props = {
  data: FragmentType<typeof Gallery_SpaceFragment>;
};

export default function Gallery({ data }: Props) {
  const space = getFragmentData(Gallery_SpaceFragment, data);
  const [images, setImages] = useState(space.images);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      if (newImages.length >= 10) break;

      try {
        const url = await uploadImage(file, `spaces/${space.id}`);
        newImages.push(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      }
    }

    setImages(newImages);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    startTransition(async () => {
      const result = await updateSpaceImagesAction(space.id, newImages);
      if (!result.success) {
        toast.error(result.error ?? "Failed to save images");
        setImages(images);
      } else {
        toast.success("Photos updated");
      }
    });
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    startTransition(async () => {
      const result = await updateSpaceImagesAction(space.id, newImages);
      if (!result.success) {
        toast.error(result.error ?? "Failed to remove image");
        setImages(images);
      } else {
        toast.success("Photo removed");
      }
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {images.length === 0 ? (
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
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={image}
                  alt={`${space.title} - ${index + 1}`}
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
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {images.length < 10 && (
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
        </div>
      )}
    </div>
  );
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const sigResponse = await fetch(
    `${env.client.apiUrl}/storage/upload-signature`,
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
