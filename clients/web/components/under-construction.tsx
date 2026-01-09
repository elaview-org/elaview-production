"use client";

import underConstructionImage from "@/public/common/under-construction.png";

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function UnderConstruction() {
    const router = useRouter();

    return <section className={"h-screen flex flex-col gap-16 justify-center items-center"}>
        <p className={"font-medium text-center lg:text-left"}>
            {"Under Construction. "}
            <span
                className={"font-medium text-semantic-1 underline cursor-pointer"}
                onClick={() => router.back()}
            >Go back ⟶</span>
        </p>
        <Image
            src={underConstructionImage}
            alt={"Under Construction"}
            className={"h-1/4 w-auto"}
        />
    </section>
}