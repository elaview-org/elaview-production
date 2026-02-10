"use client";

import { cn } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

export const Gallery_SharedSpaceFragment = graphql(`
  fragment Gallery_SharedSpaceFragment on Space {
    title
    images
  }
`);

type Props = {
  data: FragmentType<typeof Gallery_SharedSpaceFragment>;
};

export default function Gallery({ data }: Props) {
  const space = getFragmentData(Gallery_SharedSpaceFragment, data);
  const [activeIndex, setActiveIndex] = useState(0);

  if (space.images.length === 0) {
    return (
      <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
        <IconPhoto className="text-muted-foreground size-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={space.images[activeIndex]}
          alt={`${space.title} - ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 66vw, 100vw"
          unoptimized
        />
      </div>
      {space.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {space.images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-md ring-2",
                  isActive ? "ring-primary" : "opacity-60 ring-transparent"
                )}
              >
                <Image
                  src={image}
                  alt={`${space.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
