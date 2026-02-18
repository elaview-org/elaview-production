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
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
  IconTarget,
  IconUsers,
  IconShieldCheck,
  IconTrendingUp,
  IconMapPin,
  IconBulb,
  IconHeart,
  IconCheck,
  IconDeviceMobile,
  IconServer,
} from "@tabler/icons-react";

export default function Page() {
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
            <Link href="/about" className="text-foreground text-sm font-medium">
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
              About{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Elaview
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              We&apos;re building the future of hyper-local advertising by
              connecting local businesses with physical advertising space
              owners.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconBulb className="size-4" />
              Our Mission
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Empowering Local Communities Through Advertising
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Elaview is a B2B advertising marketplace that connects local
              advertisers with physical advertising space owners. Think Airbnb,
              but for storefront windows, walls, and bulletin boards.
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconTarget className="size-6" />
                </div>
                <CardTitle className="text-xl">For Advertisers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Local businesses (restaurants, gyms, salons, realtors)
                  struggle to find affordable, hyper-local advertising that
                  reaches their exact neighborhood. We solve this by providing a
                  marketplace where you can discover and book advertising spaces
                  in your target area.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconUsers className="size-6" />
                </div>
                <CardTitle className="text-xl">For Space Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Storefronts have unused window, wall, or bulletin board space
                  that could generate passive income. We make it easy to list
                  your space, set your pricing, and earn money with minimal
                  effort.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Overview */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Simple, transparent, and efficient process for both advertisers
                and space owners
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Advertiser discovers space → Books & pays (escrow)",
                "Owner accepts → Owner downloads creative file",
                "Owner prints locally → Installs → Uploads verification photos",
                "Advertiser approves → Owner gets paid",
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-background hover:border-primary/50 flex items-start gap-4 rounded-lg border p-4 transition-colors"
                >
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-base">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconUsers className="size-4" />
              Our Team
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built by Experts
            </h2>
            <p className="text-muted-foreground text-lg">
              A small, focused team building the future of local advertising
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <IconDeviceMobile className="size-8" />
                </div>
                <CardTitle className="text-2xl">Mike Anderson</CardTitle>
                <CardDescription className="text-base font-medium">
                  Mobile & Frontend Lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Owns
                    </div>
                    <p className="text-sm">Expo React Native mobile app</p>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Responsibilities
                    </div>
                    <p className="text-sm">
                      Mobile UI/UX, React Native components, mobile-specific
                      features
                    </p>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Expertise
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Expo SDK 54",
                        "React Native",
                        "TypeScript",
                        "Apollo Client",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="bg-muted rounded-md px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                  <IconServer className="size-8" />
                </div>
                <CardTitle className="text-2xl">Quang</CardTitle>
                <CardDescription className="text-base font-medium">
                  Backend & Web Lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Owns
                    </div>
                    <p className="text-sm">
                      .NET GraphQL backend, Next.js web app
                    </p>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Responsibilities
                    </div>
                    <p className="text-sm">
                      GraphQL schema, database, Stripe integration, web
                      dashboard
                    </p>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-2 text-sm font-semibold">
                      Expertise
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ".NET",
                        "HotChocolate GraphQL",
                        "PostgreSQL",
                        "Next.js 15",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="bg-muted rounded-md px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <IconHeart className="size-4" />
                Our Values
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                What We Stand For
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: IconShieldCheck,
                  title: "Trust & Security",
                  description:
                    "Secure escrow payments and verified installations ensure both parties are protected",
                },
                {
                  icon: IconTarget,
                  title: "Hyper-Local Focus",
                  description:
                    "We believe in connecting businesses with their exact neighborhoods for maximum impact",
                },
                {
                  icon: IconTrendingUp,
                  title: "Growth & Innovation",
                  description:
                    "Database-driven architecture allows us to expand without code deployments",
                },
              ].map((value) => {
                const ValueIcon = value.icon;
                return (
                  <Card
                    key={value.title}
                    className="hover:border-primary/50 border-2 text-center transition-all"
                  >
                    <CardHeader>
                      <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-lg">
                        <ValueIcon className="size-6" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Geographic Focus */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconMapPin className="size-4" />
              Where We Operate
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Starting Local, Thinking Global
            </h2>
            <p className="text-muted-foreground text-lg">
              We&apos;re launching in Southern California with plans to expand
              nationwide
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 from-primary/5 to-primary/10 border-2 bg-gradient-to-br">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IconMapPin className="text-primary size-5" />
                  Phase 1: MVP Launch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Orange County, CA",
                    "Los Angeles, CA (select areas)",
                    "Storefront advertising spaces only",
                    "Window posters, bulletin boards, wall mounts",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IconTrendingUp className="text-primary size-5" />
                  Future Expansion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Billboards and transit advertising",
                    "Vehicle wraps and mobile advertising",
                    "Digital displays and interactive ads",
                    "Nationwide coverage",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <IconCheck className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="from-primary via-primary/95 to-primary/90 relative overflow-hidden rounded-2xl bg-gradient-to-br p-1 shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <Card className="text-primary-foreground relative border-0 bg-transparent">
            <CardHeader className="pb-8 text-center">
              <CardTitle className="mb-4 text-3xl sm:text-4xl">
                Join Us on This Journey
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mx-auto max-w-2xl text-lg">
                Whether you&apos;re a local business looking to advertise or a
                space owner ready to monetize your space, we&apos;d love to have
                you join the Elaview community.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 pb-8 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                >
                  Get Started Free
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
