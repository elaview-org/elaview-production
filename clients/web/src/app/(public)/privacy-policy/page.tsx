import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/primitives/card";
import Link from "next/link";
import {
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
  IconShieldCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

export default function Page() {
  const lastUpdated = "February 17, 2026";

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
              <IconShieldCheck className="size-4" />
              Privacy Policy
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Privacy{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
              We are committed to protecting your privacy and being transparent
              about how we collect, use, and share your information.
            </p>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="container mx-auto px-4 py-24">
        <div className="prose prose-slate dark:prose-invert mx-auto max-w-4xl max-w-none">
          <div className="space-y-12">
            {/* Introduction */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Elaview (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                  operates a B2B advertising marketplace that connects local
                  advertisers with physical advertising space owners. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our website, mobile
                  application, and services (collectively, the
                  &quot;Service&quot;).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our Service, you agree to the collection and use of
                  information in accordance with this Privacy Policy. If you do
                  not agree with our policies and practices, please do not use
                  our Service.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  2. Information We Collect
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  2.1 Information You Provide
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Account Information:</strong> Name, email address,
                    phone number, password, and role (advertiser or space owner)
                  </li>
                  <li>
                    <strong>Profile Information:</strong> Business name,
                    description, location, photos, and other details you choose
                    to provide
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing address,
                    payment method details (processed securely through Stripe)
                  </li>
                  <li>
                    <strong>Booking Information:</strong> Campaign dates,
                    creative files, messages, and other booking-related data
                  </li>
                  <li>
                    <strong>Verification Data:</strong> GPS coordinates,
                    timestamps, and photos uploaded for installation
                    verification
                  </li>
                  <li>
                    <strong>Communications:</strong> Messages sent through our
                    platform, support requests, and feedback
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  2.2 Information Automatically Collected
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  When you use our Service, we automatically collect certain
                  information, including:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Device Information:</strong> Device type, operating
                    system, unique device identifiers, and mobile network
                    information
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used,
                    time spent, clicks, and other interaction data
                  </li>
                  <li>
                    <strong>Location Data:</strong> GPS coordinates when you use
                    location-based features (with your permission)
                  </li>
                  <li>
                    <strong>Log Data:</strong> IP address, browser type, access
                    times, and referring website addresses
                  </li>
                  <li>
                    <strong>Cookies and Tracking:</strong> See our Cookies
                    section below for more information
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  2.3 Information from Third Parties
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may receive information about you from third-party
                  services, including:
                </p>
                <ul className="text-muted-foreground mt-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Payment Processors:</strong> Stripe provides us with
                    payment transaction information
                  </li>
                  <li>
                    <strong>Authentication Services:</strong> If you sign in
                    through third-party providers
                  </li>
                  <li>
                    <strong>Analytics Providers:</strong> Aggregated usage and
                    performance data
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-3">
                  <li>
                    <strong>Provide and Maintain Service:</strong> Process
                    bookings, facilitate payments, and deliver our marketplace
                    services
                  </li>
                  <li>
                    <strong>Verify Installations:</strong> Validate GPS
                    coordinates and timestamps to ensure authentic installation
                    verification
                  </li>
                  <li>
                    <strong>Communicate:</strong> Send booking confirmations,
                    updates, notifications, and respond to your inquiries
                  </li>
                  <li>
                    <strong>Improve Service:</strong> Analyze usage patterns,
                    identify issues, and enhance user experience
                  </li>
                  <li>
                    <strong>Prevent Fraud:</strong> Detect and prevent
                    fraudulent activity, unauthorized access, and other security
                    threats
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> Comply with legal
                    obligations, enforce our terms, and protect our rights
                  </li>
                  <li>
                    <strong>Marketing:</strong> Send promotional communications
                    (with your consent, which you can opt out of at any time)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We do not sell your personal information. We may share your
                  information in the following circumstances:
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  4.1 With Other Users
                </h3>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    Advertisers can see space owner profiles, listings, and
                    ratings
                  </li>
                  <li>
                    Space owners can see advertiser profiles and booking
                    information
                  </li>
                  <li>
                    Verification photos are shared between parties for booking
                    completion
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  4.2 With Service Providers
                </h3>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Payment Processing:</strong> Stripe processes
                    payments and manages financial transactions
                  </li>
                  <li>
                    <strong>Cloud Storage:</strong> Cloudflare R2 stores
                    creative files and verification photos
                  </li>
                  <li>
                    <strong>Analytics:</strong> Third-party analytics services
                    help us understand usage patterns
                  </li>
                  <li>
                    <strong>Hosting:</strong> Infrastructure providers host our
                    applications and databases
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  4.3 Legal Requirements
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law, court
                  order, or government regulation, or to protect our rights,
                  property, or safety, or that of our users or others.
                </p>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">5. Data Security</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your personal information:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and updates</li>
                  <li>
                    Limited access to personal information on a need-to-know
                    basis
                  </li>
                  <li>
                    Secure payment processing through Stripe (we do not store
                    full payment card details)
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your information, we
                  cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  6. Your Rights and Choices
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Depending on your location, you may have certain rights
                  regarding your personal information:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-3">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information (subject to legal retention requirements)
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a
                    structured, machine-readable format
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                  <li>
                    <strong>Account Closure:</strong> Close your account at any
                    time through your account settings
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:privacy@elaview.com"
                    className="text-primary hover:underline"
                  >
                    privacy@elaview.com
                  </a>
                  . We will respond to your request within 30 days.
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Authenticate your session</li>
                  <li>Analyze usage patterns and improve our Service</li>
                  <li>Provide personalized content and advertisements</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You can control cookies through your browser settings.
                  However, disabling cookies may limit your ability to use
                  certain features of our Service.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">8. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary
                  to provide our Service, comply with legal obligations, resolve
                  disputes, and enforce our agreements. When you close your
                  account, we will delete or anonymize your personal
                  information, except where we are required to retain it for
                  legal, tax, or regulatory purposes.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for individuals under the age of
                  18. We do not knowingly collect personal information from
                  children. If you believe we have collected information from a
                  child, please contact us immediately, and we will take steps
                  to delete such information.
                </p>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  10. International Data Transfers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your country of residence. These
                  countries may have data protection laws that differ from those
                  in your country. We take appropriate safeguards to ensure your
                  information receives adequate protection.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new Privacy
                  Policy on this page and updating the &quot;Last updated&quot;
                  date. We encourage you to review this Privacy Policy
                  periodically for any changes.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20 bg-primary/5 border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                  <IconInfoCircle className="text-primary size-6" />
                  12. Contact Us
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@elaview.com"
                      className="text-primary hover:underline"
                    >
                      privacy@elaview.com
                    </a>
                  </p>
                  <p>
                    <strong>Support:</strong>{" "}
                    <a
                      href="mailto:support@elaview.com"
                      className="text-primary hover:underline"
                    >
                      support@elaview.com
                    </a>
                  </p>
                  <p>
                    <strong>Address:</strong> Orange County, CA, United States
                  </p>
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
            <CardContent className="pt-8 pb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">
                Questions About Privacy?
              </h3>
              <p className="text-primary-foreground/90 mx-auto mb-6 max-w-2xl">
                We&apos;re here to help. Contact our privacy team if you have
                any questions or concerns.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                  >
                    Contact Us
                    <IconArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 w-full backdrop-blur-sm sm:w-auto"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
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
                    className="text-foreground group flex items-center gap-1 font-medium"
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
