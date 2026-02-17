"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/primitives/carousel";

const IMAGES = [
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
] as const;

const AUTOPLAY_INTERVAL = 5000;

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="pt-12 md:pt-18">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Connect Your Brand with Physical Ad Spaces
          </h1>
          <p className="text-muted-foreground max-w-lg text-lg">
            Elaview is a B2B marketplace connecting local advertisers with
            physical ad space owners — storefronts, windows, walls, and more.
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>

        <Carousel opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {IMAGES.map((src, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={src}
                    alt={`Advertising space ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
