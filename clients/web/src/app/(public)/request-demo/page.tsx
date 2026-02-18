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
  IconVideo,
  IconCheck,
  IconUsers,
  IconTrendingUp,
  IconClock,
  IconInfoCircle,
} from "@tabler/icons-react";
import { DemoForm } from "./demo-form";

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
            <div className="bg-primary/10 text-primary mx-auto mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <IconVideo className="size-4" />
              Schedule a Demo
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              See Elaview in{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Action
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              Book a personalized demo and discover how Elaview can help your
              business reach local customers or monetize your space.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Demo Form */}
          <div>
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Request a Demo
              </h2>
              <p className="text-muted-foreground text-lg">
                Fill out the form below and we&apos;ll schedule a personalized
                demo at your convenience.
              </p>
            </div>

            <DemoForm />
          </div>

          {/* Demo Benefits */}
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                What to Expect
              </h2>
              <p className="text-muted-foreground text-lg">
                Our demos are personalized to show you exactly how Elaview works
                for your use case.
              </p>
            </div>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconVideo className="size-6" />
                </div>
                <CardTitle>Personalized Walkthrough</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We&apos;ll walk you through the platform features most
                  relevant to your business, whether you&apos;re an advertiser
                  or space owner.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconUsers className="size-6" />
                </div>
                <CardTitle>Q&A Session</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Ask questions about pricing, verification, payouts, or any
                  other aspect of the platform. We&apos;re here to help.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconTrendingUp className="size-6" />
                </div>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Learn tips and strategies from our team on how to maximize
                  your success on Elaview, whether you&apos;re advertising or
                  listing spaces.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 border-2 transition-all">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                  <IconClock className="size-6" />
                </div>
                <CardTitle>30-45 Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our demos typically last 30-45 minutes, giving you plenty of
                  time to see the platform and get your questions answered.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-muted/50 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconInfoCircle className="text-primary size-5" />
                  Demo Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      Conducted via video call (Zoom, Google Meet, or your
                      preference)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      No commitment required - demos are completely free
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      We&apos;ll follow up within 24 hours to schedule
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      Flexible scheduling - we work around your schedule
                    </span>
                  </div>
                </div>
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
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 mx-auto max-w-2xl text-lg">
                Don&apos;t want to wait for a demo? Sign up now and start
                exploring Elaview on your own.
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
                    className="text-foreground group flex items-center gap-1 font-medium"
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
