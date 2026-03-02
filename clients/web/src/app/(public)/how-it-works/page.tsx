import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Separator } from "@/components/primitives/separator";
import {
  IconSearch,
  IconCalendar,
  IconPrinter,
  IconCamera,
  IconCurrencyDollar,
  IconBuildingStore,
  IconListCheck,
  IconCircleCheck,
} from "@tabler/icons-react";

const ADVERTISER_STEPS = [
  {
    step: 1,
    icon: IconSearch,
    title: "Browse & discover",
    description:
      "Search thousands of ad spaces by city, neighborhood, type, and price. Filter by storefront windows, wall murals, digital displays, and more. Every listing includes dimensions, photos, and availability.",
  },
  {
    step: 2,
    icon: IconCalendar,
    title: "Book & pay securely",
    description:
      "Choose your dates, create a campaign, and pay through our secure escrow system. Your payment is held safely until your ad is installed and verified — you're never charged for work that wasn't done.",
  },
  {
    step: 3,
    icon: IconPrinter,
    title: "Download your file",
    description:
      "Once the space owner accepts your booking, download your print-ready ad file. The space owner handles local printing and installation — no logistics required on your end.",
  },
  {
    step: 4,
    icon: IconCamera,
    title: "Verify & approve",
    description:
      "The space owner uploads verification photos once your ad is installed. Review and approve within 48 hours (or we auto-approve), and the remainder of the payment is released.",
  },
];

const OWNER_STEPS = [
  {
    step: 1,
    icon: IconBuildingStore,
    title: "List your space",
    description:
      "Create a listing for any surface you own — storefronts, windows, walls, vehicles, and more. Add photos, dimensions, pricing, and availability in minutes.",
  },
  {
    step: 2,
    icon: IconListCheck,
    title: "Review & accept bookings",
    description:
      "Advertisers will request your space for specific dates. Review each request, check the campaign details, and accept or decline within 48 hours.",
  },
  {
    step: 3,
    icon: IconPrinter,
    title: "Print & install",
    description:
      "Download the advertiser's file, print locally, and install according to your standard process. You receive a print & installation fee the moment the file is downloaded.",
  },
  {
    step: 4,
    icon: IconCurrencyDollar,
    title: "Get paid",
    description:
      "Upload verification photos once the ad is up. Once the advertiser approves (or 48 hours pass), your full payout is released to your connected Stripe account.",
  },
];

const FAQS = [
  {
    q: "How does escrow work?",
    a: "When an advertiser pays for a booking, funds are held securely by Stripe. The space owner receives a print & install fee when they download the ad file, and the remainder is released once installation is verified.",
  },
  {
    q: "Who handles printing?",
    a: "The space owner handles all printing and installation locally. Advertisers provide a print-ready file, and owners use their own preferred print partners.",
  },
  {
    q: "What if the ad isn't installed correctly?",
    a: "Advertisers can raise a dispute if verification photos don't match the booking. Our team reviews disputes and mediates fairly — protecting both parties.",
  },
  {
    q: "What types of spaces can be listed?",
    a: "Storefronts, window displays, wall space, digital displays, vehicle wraps, transit shelters, and more. If it's a physical surface you own, you can list it.",
  },
  {
    q: "Is there a minimum booking duration?",
    a: "Each space owner sets their own minimum and maximum duration. Most spaces have a 7-day minimum to ensure campaigns have meaningful exposure.",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-24 py-16 md:py-24">
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          How It Works
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          From listing to launch <br></br>in days, not weeks.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Elaview makes physical advertising straightforward. Advertisers find
          and book spaces directly from owners — no brokers, no cold calls, no
          surprises.
        </p>
      </section>

      {/* For Advertisers */}
      <section>
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
            A
          </div>
          <h2 className="text-2xl font-bold">For advertisers</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ADVERTISER_STEPS.map((s) => (
            <div key={s.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                  <s.icon className="size-5" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  Step {s.step}
                </span>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/signup">Start advertising</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* For Space Owners */}
      <section>
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
            S
          </div>
          <h2 className="text-2xl font-bold">For space owners</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OWNER_STEPS.map((s) => (
            <div key={s.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                  <s.icon className="size-5" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  Step {s.step}
                </span>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/signup">List your space</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Payment protection callout */}
      <section className="bg-muted rounded-xl p-8 md:p-12">
        <h2 className="mb-6 text-2xl font-bold">Payment protection built in</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: IconCircleCheck,
              title: "Escrow on every booking",
              desc: "Funds are held by Stripe until installation is verified.",
            },
            {
              icon: IconCircleCheck,
              title: "Two-stage payout",
              desc: "Owners are paid twice: at file download and after verification.",
            },
            {
              icon: IconCircleCheck,
              title: "Dispute resolution",
              desc: "Our team mediates any installation disputes fairly.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-8 text-2xl font-bold">Frequently asked questions</h2>
        <div className="flex max-w-3xl flex-col gap-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="flex flex-col gap-2">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </p>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Our team is happy to walk you through the platform or answer specific
          questions about your use case.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/request-demo">Request a demo</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
