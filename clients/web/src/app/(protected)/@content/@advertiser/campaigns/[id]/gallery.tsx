"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconLoader2, IconPhoto, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { updateCampaignImageAction } from "../campaigns.actions";
import { toast } from "sonner";
import env from "@/lib/core/env";

export const Gallery_CampaignFragment = graphql(`
  fragment Gallery_CampaignFragment on Campaign {
    id
    name
    imageUrl
  }
`);

type Props = {
  data: FragmentType<typeof Gallery_CampaignFragment>;
};

export default function Gallery({ data }: Props) {
  const campaign = getFragmentData(Gallery_CampaignFragment, data);
  const [imageUrl, setImageUrl] = useState(campaign.imageUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const url = await uploadImage(files[0], `campaigns/${campaign.id}`);
      setImageUrl(url);

      startTransition(async () => {
        const result = await updateCampaignImageAction(campaign.id, url);
        if (!result.success) {
          toast.error(result.error ?? "Failed to save image");
          setImageUrl(campaign.imageUrl);
        } else {
          toast.success("Creative updated");
        }
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-lg border p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {imageUrl ? (
        <div className="group relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={campaign.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <button
            type="button"
            disabled={uploading || pending}
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100 disabled:opacity-50"
          >
            {uploading ? (
              <IconLoader2 className="size-8 animate-spin text-white" />
            ) : (
              <IconPlus className="size-8 text-white" />
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading || pending}
          onClick={() => inputRef.current?.click()}
          className="bg-muted hover:border-primary hover:text-primary flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <IconLoader2 className="size-8 animate-spin" />
          ) : (
            <IconPhoto className="size-8" />
          )}
          <span>{uploading ? "Uploading..." : "Upload Creative"}</span>
        </button>
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
