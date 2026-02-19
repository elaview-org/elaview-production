import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import HeroNavigation from "./hero-navigation";
import HeroBackground from "~/hero/hero-background.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <Image
        src={HeroBackground}
        alt="Advertising billboard at night"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark gradient overlay — improves text legibility over the bright billboard */}
      <div className="absolute inset-0 bg-white/5" />

      {/* Navbar sits inside the section so it overlays the image */}
      <HeroNavigation />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[90vh] items-center px-8 md:px-36">
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          {/* Headline */}
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
            Discover Hidden
            <br />
            Advertising Spaces
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-2xl text-white/60 sm:text-lg md:max-w-sm">
            Connect with space owners and advertisers in the most trusted
            advertising marketplace.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/find-spaces"
              className="flex items-center gap-2 rounded-md border border-[#2E3746]/60 bg-[#2E3746] px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-[#3a4557]"
            >
              <Search size={16} strokeWidth={2} />
              Browse Spaces
            </Link>
            <Link
              href="/list-space"
              className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              List Properties
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {/* Stacked avatars */}
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 ring-1 ring-black/20"
                  >
                    <Image
                      src={`/avatars/avatar-${i}.jpg`}
                      alt={`Customer ${i}`}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Stars + count */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-white/50">
                  Trusted by{" "}
                  <span className="font-medium text-white/80">500+</span>{" "}
                  advertisers & space owners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
