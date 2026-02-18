import { authenticatedRedirect } from "@/lib/services/auth";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import Link from "next/link";
import {
  IconMapPin,
  IconTrendingUp,
  IconUsers,
  IconShieldCheck,
  IconPhoto,
  IconDownload,
  IconCheck,
  IconArrowRight,
  IconBuildingStore,
  IconAd,
  IconCash,
  IconClock,
  IconTarget,
  IconStar,
  IconChevronRight,
} from "@tabler/icons-react";

export default async function Page() {
  await authenticatedRedirect();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <IconBuildingStore className="size-5" />
            </div>
            Elaview
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/how-it-works"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              About
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="from-background via-background to-muted/30 relative overflow-hidden bg-gradient-to-b">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
        <div className="relative container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-24 text-center sm:py-32">
          <div className="flex max-w-4xl flex-col gap-6">
            <div className="bg-muted/50 text-muted-foreground mx-auto mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
              <IconStar className="fill-primary text-primary size-4" />
              <span>Trusted by local businesses across Orange County & LA</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Connect Local Businesses with
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                {" "}
                Advertising Space
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              Elaview is a B2B marketplace connecting local advertisers with
              physical advertising space owners. Think Airbnb, but for
              storefront windows, walls, and bulletin boards.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full shadow-lg transition-shadow hover:shadow-xl sm:w-auto"
                >
                  Get Started Free
                  <IconArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "Active Spaces", value: "500+" },
                { label: "Local Businesses", value: "1,200+" },
                { label: "Campaigns", value: "2,500+" },
                { label: "Avg. ROI", value: "3.2x" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <div className="text-primary text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Simple, transparent, and efficient. Get your ads up in just a few
              steps.
            </p>
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
            {/* Connecting line for desktop */}
            <div className="from-primary/20 via-primary/40 to-primary/20 absolute top-12 right-0 left-0 hidden h-0.5 bg-gradient-to-r md:block" />
            {[
              {
                step: "1",
                title: "Discover Space",
                description:
                  "Browse available advertising spaces in your target neighborhood",
                icon: IconMapPin,
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "2",
                title: "Book & Pay",
                description:
                  "Select dates, upload your creative, and pay securely through escrow",
                icon: IconShieldCheck,
                color: "from-green-500 to-green-600",
              },
              {
                step: "3",
                title: "Owner Installs",
                description:
                  "Space owner downloads your file, prints locally, and installs",
                icon: IconDownload,
                color: "from-purple-500 to-purple-600",
              },
              {
                step: "4",
                title: "Verify & Approve",
                description:
                  "Owner uploads verification photos, you approve, and they get paid",
                icon: IconPhoto,
                color: "from-orange-500 to-orange-600",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <Card className="hover:border-primary/50 group border-2 text-center transition-all hover:shadow-lg">
                    <CardHeader>
                      <div
                        className={`bg-gradient-to-br ${item.color} mx-auto mb-4 flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform group-hover:scale-110`}
                      >
                        <Icon className="size-7" />
                      </div>
                      <div className="bg-primary text-primary-foreground absolute -top-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold">
                        {item.step}
                      </div>
                      <CardTitle className="mt-2 text-xl">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                  {index < 3 && (
                    <div className="from-primary/40 absolute top-12 -right-4 hidden h-0.5 w-8 bg-gradient-to-r to-transparent md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Advertisers */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconTarget className="size-4" />
              For Advertisers
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Reach Your Exact Neighborhood
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Connect with your local community through affordable, hyper-local
              advertising. Perfect for restaurants, gyms, salons, realtors, and
              any local business looking to grow.
            </p>
            <ul className="mb-8 space-y-4">
              {[
                {
                  icon: IconTarget,
                  text: "Hyper-local targeting - reach your exact neighborhood",
                },
                {
                  icon: IconCash,
                  text: "Affordable pricing - starting at $50/week",
                },
                {
                  icon: IconClock,
                  text: "Quick setup - get your ad live in days, not weeks",
                },
                {
                  icon: IconShieldCheck,
                  text: "Verified installations - GPS-verified photos ensure quality",
                },
                {
                  icon: IconTrendingUp,
                  text: "Flexible campaigns - 1-4 week durations",
                },
              ].map((benefit) => {
                const BenefitIcon = benefit.icon;
                return (
                  <li
                    key={benefit.text}
                    className="group flex items-start gap-3"
                  >
                    <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md transition-colors">
                      <BenefitIcon className="size-4" />
                    </div>
                    <span className="pt-0.5">{benefit.text}</span>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="shadow-md transition-shadow hover:shadow-lg"
                >
                  Start Advertising
                  <IconArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="ghost" size="lg">
                  Learn More
                  <IconChevronRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Card className="from-primary/5 to-primary/10 border-primary/20 border-2 bg-gradient-to-br">
              <CardHeader>
                <div className="from-primary to-primary/80 text-primary-foreground mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                  <IconTrendingUp className="size-7" />
                </div>
                <CardTitle className="text-2xl">Perfect For</CardTitle>
                <CardDescription className="text-base">
                  Ideal for businesses targeting local customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Restaurants",
                    "Gyms & Fitness",
                    "Hair Salons",
                    "Real Estate",
                    "Local Services",
                    "Retail Stores",
                  ].map((business) => (
                    <div
                      key={business}
                      className="hover:bg-primary/5 flex items-center gap-2 rounded-md p-2 transition-colors"
                    >
                      <IconCheck className="text-primary size-4 shrink-0" />
                      <span className="font-medium">{business}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Decorative elements */}
            <div className="bg-primary/10 absolute -top-4 -right-4 -z-10 h-32 w-32 rounded-full blur-3xl" />
            <div className="bg-primary/5 absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* For Space Owners */}
      <section className="from-muted/30 to-background bg-gradient-to-b py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <Card className="from-background to-muted/50 border-primary/10 border-2 bg-gradient-to-br shadow-xl">
                <CardHeader>
                  <div className="from-primary to-primary/80 text-primary-foreground mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
                    <IconCash className="size-7" />
                  </div>
                  <CardTitle className="text-2xl">
                    Earn Passive Income
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get paid in two simple stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
                      <div className="text-primary mb-3 flex items-center gap-2 font-semibold">
                        <IconDownload className="size-5" />
                        Stage 1: File Download
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Receive print & install fee ($10-35) immediately when
                        you download the creative file
                      </p>
                    </div>
                    <div className="rounded-lg border border-green-500/10 bg-green-500/5 p-4">
                      <div className="mb-3 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                        <IconCheck className="size-5" />
                        Stage 2: Approval
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Receive remainder when advertiser approves installation
                        (or auto-approves after 48 hours)
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <IconClock className="size-4" />
                        <span>
                          Minimal effort - print locally, install, verify.
                          That&apos;s it.
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Decorative elements */}
              <div className="bg-primary/10 absolute -top-4 -left-4 -z-10 h-32 w-32 rounded-full blur-3xl" />
              <div className="bg-primary/5 absolute -right-4 -bottom-4 -z-10 h-24 w-24 rounded-full blur-2xl" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <IconUsers className="size-4" />
                For Space Owners
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn Unused Space Into Income
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Monetize your unused window, wall, or bulletin board space with
                minimal effort. Set your own pricing and availability -
                you&apos;re in control.
              </p>
              <ul className="mb-8 space-y-4">
                {[
                  {
                    icon: IconCash,
                    text: "Set your own pricing - control your rates",
                  },
                  {
                    icon: IconDownload,
                    text: "Two-stage payout - get paid as you complete steps",
                  },
                  {
                    icon: IconClock,
                    text: "Minimal effort - print locally, install, verify",
                  },
                  {
                    icon: IconTarget,
                    text: "Flexible availability - choose when your space is available",
                  },
                  {
                    icon: IconShieldCheck,
                    text: "Verified payments - secure escrow ensures you get paid",
                  },
                ].map((benefit) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <li
                      key={benefit.text}
                      className="group flex items-start gap-3"
                    >
                      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md transition-colors">
                        <BenefitIcon className="size-4" />
                      </div>
                      <span className="pt-0.5">{benefit.text}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="shadow-md transition-shadow hover:shadow-lg"
                  >
                    List Your Space
                    <IconArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="ghost" size="lg">
                    Learn More
                    <IconChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="from-primary via-primary/95 to-primary/90 relative overflow-hidden rounded-2xl bg-gradient-to-br p-1 shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <Card className="text-primary-foreground relative border-0 bg-transparent">
            <CardHeader className="pb-8 text-center">
              <div className="bg-primary-foreground/20 mx-auto mb-6 flex size-20 items-center justify-center rounded-full backdrop-blur-sm">
                <IconAd className="size-10" />
              </div>
              <CardTitle className="mb-4 text-3xl sm:text-4xl">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mx-auto max-w-2xl text-lg">
                Join Elaview today and connect with local businesses or start
                earning from your space. No credit card required to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 pb-8 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                >
                  Create Account Free
                  <IconArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 w-full backdrop-blur-sm sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            <div>
              <Link
                href="/"
                className="group mb-4 flex items-center gap-2 font-semibold"
              >
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md transition-transform group-hover:scale-110">
                  <IconBuildingStore className="size-5" />
                </div>
                <span className="text-lg">Elaview</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connecting local businesses with physical advertising space.
                Empowering communities through hyper-local advertising.
              </p>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    How It Works
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    About
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/request-demo"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Request Demo
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Support</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Help Center
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Contact Us
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Privacy Policy
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Terms of Service
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
            <p className="text-muted-foreground text-center text-sm sm:text-left">
              © {new Date().getFullYear()} Elaview. All rights reserved.
            </p>
            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <span>Orange County, CA</span>
              <span>•</span>
              <span>Los Angeles, CA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
