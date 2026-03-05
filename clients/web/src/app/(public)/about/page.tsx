import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Separator } from "@/components/primitives/separator";
import {
  IconBuilding,
  IconHandClick,
  IconMapPin,
  IconTrendingUp,
  IconUsers,
  IconShieldCheck,
} from "@tabler/icons-react";

const VALUES = [
  {
    icon: IconHandClick,
    title: "Trust & Transparency",
    description:
      "Every transaction on Elaview is backed by clear pricing, verified identities, and a two-stage escrow that protects both parties.",
  },
  {
    icon: IconMapPin,
    title: "Local First",
    description:
      "We believe the best advertising is rooted in the community. Our marketplace connects local businesses with the physical spaces that matter most to their audience.",
  },
  {
    icon: IconTrendingUp,
    title: "Growth for Everyone",
    description:
      "Whether you're a small retailer looking to reach new customers or a space owner turning idle windows into income, Elaview creates value on both sides.",
  },
  {
    icon: IconShieldCheck,
    title: "Accountability",
    description:
      "Our verification system and review process ensure that ads get installed correctly and advertisers get exactly what they paid for.",
  },
];

const STATS = [
  { value: "500+", label: "Advertisers & space owners" },
  { value: "1,200+", label: "Ad spaces listed" },
  { value: "48 hrs", label: "Average booking approval time" },
  { value: "$2M+", label: "Paid out to space owners" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-24 py-16 md:py-24">
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          About Elaview
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          The marketplace where local advertising gets done.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Elaview connects businesses looking to advertise with the people who
          own storefronts, windows, and walls in exactly the right
          neighborhoods. No agencies. No guesswork. Just direct, transparent
          bookings.
        </p>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-3xl font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Story */}
      <section className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Our story</h2>
          <div className="text-muted-foreground flex flex-col gap-4 leading-relaxed">
            <p>
              Elaview started with a simple observation: storefronts and
              building windows are prime advertising real estate, but most of
              that space sits empty. Meanwhile, local businesses struggle to
              find affordable, targeted ad placements that actually reach the
              right people.
            </p>
            <p>
              We built Elaview to fix that — a B2B marketplace where space
              owners list their physical ad surfaces and advertisers browse,
              book, and launch campaigns without ever needing an intermediary.
            </p>
            <p>
              Our two-stage payout system was designed to give everyone
              confidence: advertisers only release the full payment once an ad
              is installed and verified, and space owners are compensated fairly
              at every step.
            </p>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">Who we serve</h2>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <IconBuilding className="size-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Advertisers</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Small businesses, agencies, and brands who need physical ad
                  placements in specific markets. Browse by location, price, and
                  space type — then book in minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <IconUsers className="size-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Space owners</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Retailers, property managers, and building owners who have
                  windows, walls, or other surfaces to rent. List once and earn
                  recurring income from your existing real estate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section>
        <h2 className="mb-10 text-2xl font-bold">What we stand for</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value.title} className="flex flex-col gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <value.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold">Ready to get started?</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Join hundreds of advertisers and space owners already using Elaview to
          grow their businesses.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Create an account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
