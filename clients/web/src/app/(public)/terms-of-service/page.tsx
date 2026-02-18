import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/primitives/card";
import Link from "next/link";
import {
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
  IconFileText,
  IconInfoCircle,
  IconAlertCircle,
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
              <IconFileText className="size-4" />
              Terms of Service
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Terms of{" "}
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
              Please read these terms carefully before using Elaview. By using
              our Service, you agree to be bound by these terms.
            </p>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="container mx-auto px-4 py-24">
        <div className="prose prose-slate dark:prose-invert mx-auto max-w-4xl max-w-none">
          <div className="space-y-12">
            {/* Introduction */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  These Terms of Service (&quot;Terms&quot;) govern your access
                  to and use of Elaview&quot;s website, mobile application, and
                  services (collectively, the &quot;Service&quot;) operated by
                  Elaview (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  By accessing or using our Service, you agree to be bound by
                  these Terms and our Privacy Policy. If you disagree with any
                  part of these Terms, you may not access or use the Service.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of material changes by posting the updated
                  Terms on this page and updating the &quot;Last updated&quot;
                  date. Your continued use of the Service after such changes
                  constitutes acceptance of the modified Terms.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Elaview is a B2B advertising marketplace that connects local
                  advertisers (&quot;Advertisers&quot;) with physical
                  advertising space owners (&quot;Space Owners&quot;). Our
                  Service facilitates:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    Discovery and booking of advertising spaces (storefront
                    windows, walls, bulletin boards, etc.)
                  </li>
                  <li>Secure payment processing through escrow</li>
                  <li>Creative file delivery and management</li>
                  <li>
                    Installation verification through GPS-validated photos
                  </li>
                  <li>Two-stage payout system for Space Owners</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We act as an intermediary platform and are not a party to the
                  advertising agreements between Advertisers and Space Owners.
                  We facilitate transactions but do not guarantee the
                  performance of either party.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">3. User Accounts</h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  3.1 Account Registration
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  To use certain features of our Service, you must register for
                  an account. You agree to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>
                    Maintain and update your account information as necessary
                  </li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>Be at least 18 years old</li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  3.2 Account Types
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  You may register as an Advertiser, Space Owner, or both. You
                  must accurately represent your role and provide truthful
                  information about your business or available spaces.
                </p>
              </CardContent>
            </Card>

            {/* Booking and Payment */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  4. Booking and Payment Terms
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  4.1 Booking Process
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  When an Advertiser requests a booking:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    The Space Owner has a specified period to accept or decline
                    the booking
                  </li>
                  <li>
                    Upon acceptance, payment is processed and held in escrow
                  </li>
                  <li>
                    Full payment (rental fee + platform fee + print/install fee)
                    is required at booking confirmation
                  </li>
                  <li>
                    Campaigns typically run for 1-4 weeks as specified in the
                    booking
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  4.2 Payment Processing
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Payments are processed securely through Stripe. You agree to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Provide valid payment information</li>
                  <li>Authorize charges for bookings you accept or create</li>
                  <li>
                    Pay all applicable fees (rental, platform fee, print/install
                    fee)
                  </li>
                  <li>Comply with Stripe&apos;s terms of service</li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">4.3 Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Space Owners set their own weekly rental prices. Elaview
                  charges a platform fee of 15% of the rental cost. Print and
                  install fees range from $10-35 depending on space type. All
                  fees are clearly displayed before booking confirmation.
                </p>
              </CardContent>
            </Card>

            {/* Space Owner Obligations */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  5. Space Owner Obligations
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  As a Space Owner, you agree to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Accurate Listings:</strong> Provide accurate
                    descriptions, photos, dimensions, and pricing for your
                    spaces
                  </li>
                  <li>
                    <strong>Acceptance:</strong> Respond to booking requests
                    within the specified timeframe
                  </li>
                  <li>
                    <strong>File Download:</strong> Download the creative file
                    promptly after accepting a booking
                  </li>
                  <li>
                    <strong>Installation:</strong> Print the creative locally
                    and install it at the specified space within the agreed
                    timeframe
                  </li>
                  <li>
                    <strong>Verification:</strong> Upload GPS-validated
                    verification photos using the in-app camera (3 photos: wide
                    shot, close-up, angle shot)
                  </li>
                  <li>
                    <strong>Maintenance:</strong> Ensure the installation
                    remains in good condition for the duration of the campaign
                  </li>
                  <li>
                    <strong>Compliance:</strong> Comply with all local laws,
                    regulations, and permits related to advertising displays
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Failure to fulfill these obligations may result in
                  cancellation, refund to the Advertiser, and potential account
                  suspension.
                </p>
              </CardContent>
            </Card>

            {/* Advertiser Obligations */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  6. Advertiser Obligations
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  As an Advertiser, you agree to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Creative Files:</strong> Provide creative files in
                    approved formats (PDF, PNG, JPG) meeting size and resolution
                    requirements
                  </li>
                  <li>
                    <strong>Content:</strong> Ensure your creative content
                    complies with all applicable laws and does not infringe on
                    third-party rights
                  </li>
                  <li>
                    <strong>Payment:</strong> Pay all fees promptly upon booking
                    confirmation
                  </li>
                  <li>
                    <strong>Review:</strong> Review verification photos and
                    approve or dispute installations within a reasonable
                    timeframe
                  </li>
                  <li>
                    <strong>Auto-Approval:</strong> Understand that
                    installations auto-approve after 48 hours if not manually
                    reviewed
                  </li>
                  <li>
                    <strong>No Interference:</strong> Not interfere with the
                    Space Owner&apos;s installation or maintenance of your ad
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Creative files must meet specifications: Max 25MB (10MB for
                  bulletin boards), minimum 150 DPI resolution, and dimensions
                  matching the space specifications.
                </p>
              </CardContent>
            </Card>

            {/* Verification and Installation */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  7. Verification and Installation
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  7.1 Verification Requirements
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Space Owners must provide verification photos that:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    Are taken using the in-app camera (gallery uploads are
                    disabled to prevent fraud)
                  </li>
                  <li>Include 3 photos: wide shot, close-up, and angle shot</li>
                  <li>
                    Include GPS coordinates validated within 100 meters of the
                    listing location
                  </li>
                  <li>Include server-verified timestamps</li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  7.2 Approval Process
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Advertisers may approve or dispute verification photos. If no
                  action is taken within 48 hours, the installation is
                  automatically approved. Disputes are reviewed by Elaview
                  support.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  7.3 Two-Stage Payout
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Space Owners receive payments in two stages: (1) Print &
                  install fee ($10-35) upon file download, and (2) Remaining
                  rental payment upon Advertiser approval or auto-approval after
                  48 hours.
                </p>
              </CardContent>
            </Card>

            {/* Cancellation and Refunds */}
            <Card className="border-warning/20 bg-warning/5 border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                  <IconAlertCircle className="text-warning size-6" />
                  8. Cancellation and Refunds
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  8.1 Cancellation by Advertiser
                </h3>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    <strong>Before file download:</strong> Full refund to
                    Advertiser
                  </li>
                  <li>
                    <strong>After file download:</strong> Print & install fee
                    ($10-35) retained by Space Owner, remainder refunded to
                    Advertiser
                  </li>
                </ul>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  8.2 Cancellation by Space Owner
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  If a Space Owner cancels after accepting a booking, the
                  Advertiser receives a full refund, and the Space Owner may be
                  subject to penalties or account restrictions.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  8.3 Disputes
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Disputes regarding installation quality, verification, or
                  other issues are reviewed by Elaview. We reserve the right to
                  issue refunds, adjust payouts, or take other actions as we
                  deem appropriate.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  9. Intellectual Property
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  9.1 Your Content
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  You retain ownership of your creative content, listings, and
                  other materials you submit to the Service. By submitting
                  content, you grant Elaview a license to use, display, and
                  distribute your content as necessary to provide the Service.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  9.2 Elaview&apos;s Property
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  The Service, including its design, features, and
                  functionality, is owned by Elaview and protected by copyright,
                  trademark, and other intellectual property laws. You may not
                  copy, modify, or create derivative works without our
                  permission.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  9.3 Infringement
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You represent that your content does not infringe on the
                  intellectual property rights of others. We reserve the right
                  to remove content that violates these rights.
                </p>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">10. Prohibited Uses</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  You agree not to use the Service to:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious code, viruses, or harmful content</li>
                  <li>
                    Engage in fraudulent, deceptive, or misleading practices
                  </li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Circumvent payment or verification systems</li>
                  <li>
                    Use automated systems to access the Service without
                    permission
                  </li>
                  <li>Impersonate others or provide false information</li>
                  <li>
                    Interfere with the Service&apos;s operation or security
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Violation of these prohibitions may result in immediate
                  account termination and legal action.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">11. Disclaimers</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                  WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL
                  WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    Merchantability, fitness for a particular purpose, and
                    non-infringement
                  </li>
                  <li>Accuracy, completeness, or reliability of content</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>
                    Security or freedom from viruses or harmful components
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We do not guarantee the performance of Advertisers or Space
                  Owners, the quality of installations, or the results of
                  advertising campaigns.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  12. Limitation of Liability
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ELAVIEW SHALL NOT BE
                  LIABLE FOR:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>
                    Indirect, incidental, special, consequential, or punitive
                    damages
                  </li>
                  <li>
                    Loss of profits, revenue, data, or business opportunities
                  </li>
                  <li>
                    Damages arising from your use or inability to use the
                    Service
                  </li>
                  <li>Disputes between Advertisers and Space Owners</li>
                  <li>Third-party actions or content</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Our total liability shall not exceed the amount you paid us in
                  the 12 months preceding the claim, or $100, whichever is
                  greater.
                </p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">13. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Elaview and
                  its officers, directors, employees, and agents from any
                  claims, damages, losses, liabilities, and expenses (including
                  legal fees) arising from your use of the Service, violation of
                  these Terms, or infringement of any rights of another party.
                </p>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  14. Dispute Resolution
                </h2>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  14.1 Informal Resolution
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Before filing a formal claim, you agree to contact us at
                  support@elaview.com to attempt to resolve the dispute
                  informally.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  14.2 Binding Arbitration
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Any disputes that cannot be resolved informally shall be
                  resolved through binding arbitration in accordance with the
                  rules of the American Arbitration Association, conducted in
                  Orange County, California.
                </p>

                <h3 className="mt-6 mb-3 text-xl font-semibold">
                  14.3 Class Action Waiver
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to resolve disputes individually and waive any right
                  to participate in class actions or consolidated proceedings.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">
                  15. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time.
                  Material changes will be notified by posting updated Terms on
                  this page and updating the &quot;Last updated&quot; date. Your
                  continued use of the Service after changes constitutes
                  acceptance. If you do not agree to the changes, you must stop
                  using the Service.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold">16. Termination</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We may suspend or terminate your account at any time for:
                </p>
                <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees</li>
                  <li>
                    Any reason we deem necessary to protect the Service or other
                    users
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You may terminate your account at any time through your
                  account settings. Upon termination, your right to use the
                  Service immediately ceases, but provisions that by their
                  nature should survive will remain in effect.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20 bg-primary/5 border-2">
              <CardContent className="pt-6">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                  <IconInfoCircle className="text-primary size-6" />
                  17. Contact Information
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@elaview.com"
                      className="text-primary hover:underline"
                    >
                      legal@elaview.com
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
                Questions About These Terms?
              </h3>
              <p className="text-primary-foreground/90 mx-auto mb-6 max-w-2xl">
                Contact our legal team if you have any questions or concerns
                about these Terms of Service.
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
                    className="text-muted-foreground hover:text-foreground group flex items-center gap-1 transition-colors"
                  >
                    Privacy Policy
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-foreground group flex items-center gap-1 font-medium"
                  >
                    Terms of Service
                    <IconChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
            <p
              suppressHydrationWarning
              className="text-muted-foreground text-center text-sm sm:text-left"
            >
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
