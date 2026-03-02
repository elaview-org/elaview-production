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
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12 text-sm">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="text-foreground flex flex-col gap-10">
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Elaview platform
              (&ldquo;Services&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you are using the Services on
              behalf of an organization, you represent that you have authority
              to bind that organization to these Terms. If you do not agree, do
              not use the Services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              2. Description of Services
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Elaview is a B2B marketplace that connects advertisers with owners
              of physical advertising spaces (storefronts, windows, walls,
              vehicles, and similar surfaces). Elaview facilitates the
              discovery, booking, payment, and verification of physical
              advertising placements. Elaview is not a party to agreements
              between advertisers and space owners but provides the platform
              infrastructure and escrow services to facilitate those
              transactions.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">3. Accounts</h2>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                You must be at least 18 years old and have the legal authority
                to enter into contracts to create an account.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activity under your account.
              </li>
              <li>
                You must provide accurate, current, and complete information
                during registration and keep it updated.
              </li>
              <li>
                Elaview reserves the right to suspend or terminate accounts that
                violate these Terms.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              4. Booking and Payment
            </h2>
            <h3 className="mb-2 font-semibold">4.1 Escrow</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              All payments are processed through Stripe and held in escrow until
              installation is verified. By completing a booking, advertisers
              authorize Elaview to hold funds on their behalf.
            </p>
            <h3 className="mb-2 font-semibold">4.2 Two-Stage Payout</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Space owners receive a print and installation fee upon file
              download (Stage 1) and the remaining payout upon advertiser
              verification of installation (Stage 2). Elaview deducts a platform
              fee from each payout as disclosed during booking.
            </p>
            <h3 className="mb-2 font-semibold">4.3 Refunds</h3>
            <p className="text-muted-foreground leading-relaxed">
              Refunds are issued at Elaview&apos;s discretion following a
              dispute resolution process. Stage 1 fees are non-refundable once
              the ad file has been downloaded. Disputes must be raised within 48
              hours of the installation verification deadline.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              5. Space Owner Obligations
            </h2>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                Space owners represent that they have the legal right to offer
                their surfaces for advertising.
              </li>
              <li>
                Space owners must install ads in compliance with the booking
                specifications, local laws, and any applicable building or
                zoning regulations.
              </li>
              <li>
                Space owners must upload accurate verification photos within the
                timeframe specified in the booking.
              </li>
              <li>
                Submitting false verification photos or misrepresenting
                installation status is grounds for account termination and may
                result in legal action.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              6. Advertiser Obligations
            </h2>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>
                Advertisers must ensure that ad content complies with all
                applicable laws, including truth-in-advertising standards.
              </li>
              <li>
                Ad content must not be defamatory, obscene, fraudulent, or in
                violation of any third-party intellectual property rights.
              </li>
              <li>
                Advertisers must respond to installation verification requests
                within 48 hours or verification will be auto-approved.
              </li>
              <li>
                Advertisers may not use the platform to circumvent Elaview and
                deal directly with space owners outside the platform.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">7. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You may not use the Services to:
            </p>
            <ul className="text-muted-foreground flex flex-col gap-2 pl-4 leading-relaxed">
              <li>Violate any applicable law or regulation</li>
              <li>Post illegal, harmful, or offensive advertising content</li>
              <li>
                Circumvent, disable, or interfere with security features of the
                platform
              </li>
              <li>
                Use automated means to scrape, crawl, or data-mine the platform
                without written consent
              </li>
              <li>
                Create fake listings, submit fraudulent bookings, or manipulate
                reviews
              </li>
              <li>
                Impersonate another person or entity or misrepresent your
                affiliation
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              8. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Elaview platform, including its design, software, and content,
              is owned by Elaview, Inc. and protected by intellectual property
              laws. You retain ownership of content you upload (ad files,
              photos, descriptions), but grant Elaview a limited license to
              display and process that content for the purpose of operating the
              Services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              9. Disclaimers and Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES
              OF ANY KIND. ELAVIEW DOES NOT GUARANTEE THE QUALITY, SAFETY, OR
              LEGALITY OF LISTED SPACES OR ADS, THE ACCURACY OF LISTINGS, OR
              THAT BOOKINGS WILL BE COMPLETED.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ELAVIEW SHALL NOT BE
              LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the State of California,
              without regard to its conflict of law provisions. Any disputes
              arising under these Terms shall be resolved exclusively in the
              state or federal courts located in San Francisco, California.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Elaview may modify these Terms at any time. We will provide at
              least 30 days&apos; notice of material changes. Your continued use
              of the Services after the effective date of changes constitutes
              your acceptance of the revised Terms.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-xl font-semibold">12. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Contact us at:
            </p>
            <address className="text-muted-foreground mt-4 leading-relaxed not-italic">
              Elaview, Inc.
              <br />
              Attn: Legal
              <br />
              San Francisco, CA
              <br />
              <a
                href="mailto:legal@elaview.com"
                className="underline underline-offset-4"
              >
                legal@elaview.com
              </a>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
