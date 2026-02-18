"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import Link from "next/link";
import {
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
  IconMail,
  IconMapPin,
  IconClock,
  IconSend,
  IconCheck,
} from "@tabler/icons-react";

export default function Page() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Get in{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <IconSend className="size-4" />
                Send us a Message
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>
            </div>

            {isSubmitted ? (
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-green-500 text-white">
                      <IconCheck className="size-8" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We&apos;ll get back to you
                        soon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({ ...formState, subject: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                    />
                    <FieldDescription>
                      Please provide as much detail as possible so we can help
                      you better.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <IconSend className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="mb-8">
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <IconMail className="size-4" />
                Contact Information
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Other Ways to Reach Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Prefer a different method? Here are other ways to get in touch.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="hover:border-primary/50 border-2 transition-all">
                <CardHeader>
                  <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                    <IconMail className="size-6" />
                  </div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:support@elaview.com"
                    className="text-primary font-medium hover:underline"
                  >
                    support@elaview.com
                  </a>
                  <CardDescription className="mt-2">
                    For general inquiries and support
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 border-2 transition-all">
                <CardHeader>
                  <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                    <IconMapPin className="size-6" />
                  </div>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Orange County, CA</p>
                  <CardDescription className="mt-2">
                    Currently serving Orange County and Los Angeles areas
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 border-2 transition-all">
                <CardHeader>
                  <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-lg">
                    <IconClock className="size-6" />
                  </div>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Within 24 hours</p>
                  <CardDescription className="mt-2">
                    We typically respond to all inquiries within one business
                    day
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Help Resources */}
            <Card className="bg-muted/50 border-2">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Check out these resources before reaching out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="/help"
                    className="hover:bg-background group flex items-center justify-between rounded-lg p-3 transition-colors"
                  >
                    <span className="font-medium">Help Center</span>
                    <IconChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-all group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="hover:bg-background group flex items-center justify-between rounded-lg p-3 transition-colors"
                  >
                    <span className="font-medium">How It Works</span>
                    <IconChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-all group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/about"
                    className="hover:bg-background group flex items-center justify-between rounded-lg p-3 transition-colors"
                  >
                    <span className="font-medium">About Elaview</span>
                    <IconChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-all group-hover:translate-x-1" />
                  </Link>
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
                    className="text-foreground group flex items-center gap-1 font-medium"
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
