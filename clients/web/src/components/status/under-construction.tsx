"use client";

import underConstructionImage from "~/common/under-construction.png";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <section className={"flex flex-col items-center justify-center gap-16"}>
      <p className={"text-center font-medium lg:text-left"}>
        {"Under Construction. "}
        <span
          className={"text-semantic-1 cursor-pointer font-medium underline"}
          onClick={() => router.back()}
        >
          Go back ⟶
        </span>
      </p>
      <Image
        src={underConstructionImage}
        alt={"Under Construction"}
        className={"h-1/4 w-auto"}
      />
    </section>
  );
}
