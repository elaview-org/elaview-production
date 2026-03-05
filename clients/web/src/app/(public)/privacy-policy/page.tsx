import { Separator } from "@/components/primitives/separator";

const LAST_UPDATED = "March 1, 2026";

export default function Page() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          Legal
        </p>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12 text-sm">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-sm text-foreground flex flex-col gap-10">
          <section>
            <h2 className="mb-4 text-xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Elaview, Inc. (&ldquo;Elaview,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Elaview
              platform, a B2B marketplace connecting advertisers with space
              owners for physical advertising placements. This Privacy Policy
              explains how we collect, use, disclose, and protect your personal
              information when you use our website, mobile application, and
              related services (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              By using the Services, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with this policy, please do not use the Services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              2. Information We Collect
            </h2>
            <h3 className="mb-2 font-semibold">2.1 Information you provide</h3>
            <ul className="text-muted-foreground mb-4 flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                <strong>Account information:</strong> Name, email address,
                password, phone number, and profile photo.
              </li>
              <li>
                <strong>Business information:</strong> Company name, business
                type, tax ID (for payouts), and billing address.
              </li>
              <li>
                <strong>Payment information:</strong> Processed via Stripe.
                Elaview does not store raw card details.
              </li>
              <li>
                <strong>Listing information:</strong> Photos, descriptions,
                dimensions, pricing, and location data for ad spaces.
              </li>
              <li>
                <strong>Communications:</strong> Messages sent through the
                platform between advertisers and space owners.
              </li>
            </ul>

            <h3 className="mb-2 font-semibold">
              2.2 Information collected automatically
            </h3>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                <strong>Usage data:</strong> Pages visited, features used,
                clicks, and session duration.
              </li>
              <li>
                <strong>Device information:</strong> IP address, browser type,
                operating system, and device identifiers.
              </li>
              <li>
                <strong>Location data:</strong> Approximate location inferred
                from IP address for search and analytics.
              </li>
              <li>
                <strong>Cookies:</strong> See Section 5 for details.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>To provide, maintain, and improve the Services</li>
              <li>
                To process bookings, payments, and payouts through Stripe
                Connect
              </li>
              <li>
                To facilitate communication between advertisers and space owners
              </li>
              <li>
                To verify identities and prevent fraud or unauthorized activity
              </li>
              <li>
                To send transactional emails (booking confirmations, payout
                notifications)
              </li>
              <li>
                To send marketing communications (with your consent, where
                required)
              </li>
              <li>
                To comply with legal obligations and enforce our Terms of
                Service
              </li>
              <li>To analyze usage patterns and improve user experience</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              4. Sharing Your Information
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                <strong>Other users:</strong> Space owners see advertiser
                company name and campaign details; advertisers see space owner
                contact info after a booking is accepted.
              </li>
              <li>
                <strong>Stripe:</strong> For payment processing and identity
                verification. Governed by Stripe&apos;s Privacy Policy.
              </li>
              <li>
                <strong>Cloudflare:</strong> For content delivery and media
                storage.
              </li>
              <li>
                <strong>Analytics providers:</strong> Aggregated, de-identified
                usage data only.
              </li>
              <li>
                <strong>Law enforcement:</strong> When required by law or to
                protect the rights and safety of users.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">5. Cookies</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We use cookies and similar tracking technologies for:
            </p>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                <strong>Authentication:</strong> Keeping you logged in securely.
              </li>
              <li>
                <strong>Preferences:</strong> Remembering your view settings,
                theme, and filters.
              </li>
              <li>
                <strong>Analytics:</strong> Understanding how the platform is
                used to improve it.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              You can control cookies through your browser settings. Disabling
              certain cookies may affect platform functionality.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is
              active or as needed to provide the Services. You may request
              deletion of your account and associated data at any time through
              account settings. We may retain certain data for legal compliance,
              fraud prevention, and dispute resolution purposes for up to 7
              years following account closure.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                <strong>Access:</strong> Request a copy of the data we hold
                about you.
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate or incomplete
                information.
              </li>
              <li>
                <strong>Deletion:</strong> Request removal of your personal
                data.
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a structured,
                machine-readable format.
              </li>
              <li>
                <strong>Objection:</strong> Object to processing based on
                legitimate interests.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@elaview.com"
                className="underline underline-offset-4"
              >
                privacy@elaview.com
              </a>
              .
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">8. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including
              encryption in transit (TLS), encrypted storage, and access
              controls. However, no method of transmission over the internet is
              100% secure. We encourage you to use a strong, unique password and
              to report any suspected security issues to{" "}
              <a
                href="mailto:security@elaview.com"
                className="underline underline-offset-4"
              >
                security@elaview.com
              </a>
              .
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">9. Children</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Services are not directed to individuals under 18 years of
              age. We do not knowingly collect personal information from
              children. If you believe we have inadvertently collected such
              information, please contact us immediately.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              10. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you
              of material changes by email or by posting a notice on the
              platform. Continued use of the Services after such notice
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions or concerns about this Privacy Policy, please
              contact:
            </p>
            <address className="text-muted-foreground mt-4 leading-relaxed not-italic">
              Elaview, Inc.
              <br />
              Attn: Privacy
              <br />
              San Francisco, CA
              <br />
              <a
                href="mailto:privacy@elaview.com"
                className="underline underline-offset-4"
              >
                privacy@elaview.com
              </a>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
