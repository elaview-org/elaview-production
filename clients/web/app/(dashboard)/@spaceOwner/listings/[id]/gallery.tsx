"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useRef, useState } from "react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, url]);
    });

    // TODO: upload files to server
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // TODO: delete from server
  };

  return (
    <div className="rounded-lg border p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-muted hover:border-primary hover:text-primary flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
        >
          <IconPhoto className="size-8" />
          <span>Add Photos</span>
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
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
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
                onClick={() => inputRef.current?.click()}
                className="text-muted-foreground hover:border-primary hover:text-primary flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors"
              >
                <IconPlus className="size-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
