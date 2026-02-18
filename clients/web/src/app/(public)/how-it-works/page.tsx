import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import Link from "next/link";
import { headers } from "next/headers";
import {
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
  IconMapPin,
  IconShieldCheck,
  IconDownload,
  IconPhoto,
  IconCheck,
  IconCash,
  IconClock,
  IconTarget,
  IconUsers,
  IconTrendingUp,
  IconFile,
  IconCamera,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";

export default async function Page() {
  // Read headers first to mark component as dynamic, then use Date
  const headersList = await headers();
  // Access a header to ensure it's actually read
  headersList.get("user-agent");
  const currentYear = new Date().getFullYear();
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
              className="text-foreground text-sm font-medium"
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              How It{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              Simple, transparent, and efficient. Get your ads up or start
              earning from your space in just a few steps.
            </p>
          </div>
        </div>
      </section>

      {/* Main Process Flow */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconTarget className="size-4" />
              The Process
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From Discovery to Installation
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Our streamlined process ensures both advertisers and space owners
              have a smooth experience
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
                details:
                  "Search by location, space type, and availability. View photos, pricing, and space specifications.",
              },
              {
                step: "2",
                title: "Book & Pay",
                description:
                  "Select dates, upload your creative, and pay securely through escrow",
                icon: IconShieldCheck,
                color: "from-green-500 to-green-600",
                details:
                  "Choose your campaign dates (1-4 weeks), upload your creative file, and pay securely. Funds are held in escrow until installation is verified.",
              },
              {
                step: "3",
                title: "Owner Installs",
                description:
                  "Space owner downloads your file, prints locally, and installs",
                icon: IconDownload,
                color: "from-purple-500 to-purple-600",
                details:
                  "Owner accepts booking, downloads your creative file, prints at a local print shop (FedEx, Staples), and installs the ad.",
              },
              {
                step: "4",
                title: "Verify & Approve",
                description:
                  "Owner uploads verification photos, you approve, and they get paid",
                icon: IconPhoto,
                color: "from-orange-500 to-orange-600",
                details:
                  "Owner uploads GPS-verified photos. You review and approve (or auto-approve after 48 hours). Owner receives final payment.",
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
                      <CardDescription className="mb-3 text-base">
                        {item.description}
                      </CardDescription>
                      <div className="text-muted-foreground bg-muted/50 rounded-md p-3 text-left text-sm">
                        {item.details}
                      </div>
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

      {/* For Advertisers Detailed */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconUsers className="size-4" />
              For Advertisers
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Getting Started as an Advertiser
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know to launch your first campaign
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <IconMapPin className="size-5" />
                  </div>
                  <CardTitle className="text-xl">
                    1. Find Your Perfect Space
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3">
                  <li className="flex items-start gap-3">
                    <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                    <span>
                      Browse spaces by neighborhood, space type, and
                      availability
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                    <span>View detailed photos, dimensions, and pricing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                    <span>
                      Check space owner ratings and past campaign reviews
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <IconFile className="size-5" />
                  </div>
                  <CardTitle className="text-xl">
                    2. Prepare Your Creative
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold">File Requirements:</p>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Formats: PDF, PNG, or JPG</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Max size: 25MB (10MB for bulletin boards)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Minimum resolution: 150 DPI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Dimensions must match space specifications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <IconCash className="size-5" />
                  </div>
                  <CardTitle className="text-xl">
                    3. Pricing & Payment
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold">Pricing Model:</p>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Per-week rental pricing set by space owner</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Typical campaigns: 1-4 weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>
                          Print & install fee: $10-35 (varies by space type)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>Platform fee: 15% of rental cost</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      <IconInfoCircle className="mr-1 inline size-4" />
                      Payment is held in escrow until installation is verified.
                      You only pay once the booking is confirmed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Space Owners Detailed */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <IconTrendingUp className="size-4" />
                For Space Owners
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Earning from Your Space
              </h2>
              <p className="text-muted-foreground text-lg">
                Turn your unused space into passive income
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <IconCash className="size-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Two-Stage Payout System
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-4">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                        <IconDownload className="size-5" />
                        Stage 1: File Download
                      </div>
                      <p className="text-muted-foreground text-sm">
                        When you accept a booking and download the creative
                        file, you immediately receive the print & install fee
                        ($10-35).
                      </p>
                    </div>
                    <div className="rounded-lg border border-green-500/10 bg-green-500/5 p-4">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                        <IconCheck className="size-5" />
                        Stage 2: Approval
                      </div>
                      <p className="text-muted-foreground text-sm">
                        After installation is verified and approved (or
                        auto-approved after 48 hours), you receive the remaining
                        rental payment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <IconCamera className="size-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Verification Process
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-3 font-semibold">Photo Requirements:</p>
                      <ul className="text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                          <span>
                            3 photos required: wide shot, close-up, and angle
                            shot
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                          <span>
                            Photos must be taken with in-app camera (no gallery
                            uploads)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                          <span>
                            GPS validation within 100m of listing location
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                          <span>
                            Server-verified timestamp ensures authenticity
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-warning/5 border-warning/10 rounded-lg border p-4">
                      <p className="text-muted-foreground flex items-start gap-2 text-sm">
                        <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>
                          Fraud prevention: Gallery uploads are disabled to
                          ensure photos are taken at the actual installation
                          location.
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <IconClock className="size-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Installation Process
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground space-y-3">
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>
                        Download the creative file from your booking dashboard
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>
                        Print at a local print shop (FedEx, Staples, or similar)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>Install the ad at your space</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>
                        Take verification photos using the in-app camera
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>
                        Upload photos - advertiser reviews and approves
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Fees */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconCash className="size-4" />
              Pricing & Fees
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              No hidden fees. Everything is clear upfront.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">For Advertisers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold">What You Pay:</p>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Space rental fee (per week, set by owner)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Platform fee: 15% of rental cost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Print & install fee: $10-35 (one-time)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
                    <p className="mb-1 text-sm font-semibold">Example:</p>
                    <p className="text-muted-foreground text-sm">
                      $100/week × 2 weeks = $200 rental
                      <br />
                      + $30 platform fee (15%)
                      <br />
                      + $20 print/install
                      <br />
                      <span className="text-foreground font-semibold">
                        Total: $250
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">For Space Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold">What You Earn:</p>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Set your own weekly rental price</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Keep 85% of rental revenue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Print & install fee: $10-35 (paid upfront)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
                    <p className="mb-1 text-sm font-semibold">Example:</p>
                    <p className="text-muted-foreground text-sm">
                      $100/week × 2 weeks = $200 rental
                      <br />
                      - $30 platform fee (15%)
                      <br />
                      + $20 print/install (Stage 1)
                      <br />
                      <span className="text-foreground font-semibold">
                        You earn: $190
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-warning/20 bg-warning/5 mt-6 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconAlertCircle className="text-warning size-5" />
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Before file download:</span>{" "}
                  Full refund to advertiser
                </p>
                <p>
                  <span className="font-semibold">After file download:</span>{" "}
                  Print & install fee kept by owner, remainder refunded to
                  advertiser
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="from-primary via-primary/95 to-primary/90 relative overflow-hidden rounded-2xl bg-gradient-to-br p-1 shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <Card className="text-primary-foreground relative border-0 bg-transparent">
            <CardHeader className="pb-8 text-center">
              <CardTitle className="mb-4 text-3xl sm:text-4xl">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mx-auto max-w-2xl text-lg">
                Join Elaview today and start connecting with local businesses or
                monetize your advertising space.
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
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 w-full backdrop-blur-sm sm:w-auto"
                >
                  Contact Us
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
                    className="text-foreground group flex items-center gap-1 font-medium"
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
              © {currentYear} Elaview. All rights reserved.
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
