import { FAQSection } from "./faq-section";
import { QuickLinks } from "./quick-links";
import { ContactSupport } from "./contact-support";
import { HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category:
    | "getting-started"
    | "advertiser"
    | "space-owner"
    | "billing"
    | "account";
}

const allFAQs: FAQ[] = [
  // Getting Started
  {
    id: "gs-1",
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up' button in the top right corner. Choose whether you're an Advertiser or Space Owner, fill in your details, and verify your email address. Once verified, you can start using Elaview!",
    category: "getting-started",
  },
  {
    id: "gs-2",
    question: "What is Elaview?",
    answer:
      "Elaview is a B2B advertising marketplace that connects local advertisers with physical advertising space owners. Think Airbnb, but for storefront windows, walls, and bulletin boards. Advertisers can discover and book spaces, while space owners can monetize their unused advertising space.",
    category: "getting-started",
  },
  {
    id: "gs-3",
    question: "Is Elaview available in my area?",
    answer:
      "Currently, Elaview is available in Orange County, CA and select areas of Los Angeles, CA. We're expanding to more cities soon! Check our map view to see available spaces in your area.",
    category: "getting-started",
  },

  // Advertiser FAQs
  {
    id: "adv-1",
    question: "How do I book an advertising space?",
    answer:
      "1. Browse available spaces using the Discover page\n2. Click on a space to view details\n3. Click 'Book Now' and select your dates\n4. Upload your creative file (PDF, PNG, or JPG). Submit your booking request\n6. Once approved by the space owner, complete payment\n\nThe space owner will then print and install your creative, upload verification photos, and you'll approve the installation.",
    category: "advertiser",
  },
  {
    id: "adv-2",
    question: "What file formats are accepted for creatives?",
    answer:
      "We accept PDF, PNG, and JPG files. Files must be:\n• Maximum 25MB (10MB for bulletin boards)\n• Minimum 150 DPI resolution\n• Dimensions matching the space specifications\n\nYour file will be validated automatically when you upload it.",
    category: "advertiser",
  },
  {
    id: "adv-3",
    question: "How long does a booking last?",
    answer:
      "Bookings typically last 1-4 weeks, but you can choose any date range that works for your campaign. The space owner sets the price per week, and you'll see the total cost before confirming.",
    category: "advertiser",
  },
  {
    id: "adv-4",
    question: "What happens if I need to cancel a booking?",
    answer:
      "Cancellation policies depend on the booking status:\n• Before file download: Full refund\n• After file download: Print/install fee kept by owner, remainder refunded\n\nYou can cancel bookings from your Bookings page. Refunds are processed within 5-7 business days.",
    category: "advertiser",
  },
  {
    id: "adv-5",
    question: "How do I approve installation photos?",
    answer:
      "When a space owner uploads verification photos, you'll receive a notification. Go to your booking details page, review the photos, and click 'Approve Installation' if everything looks correct. If there's an issue, you can open a dispute. Installations auto-approve after 48 hours if you don't take action.",
    category: "advertiser",
  },

  // Space Owner FAQs
  {
    id: "so-1",
    question: "How do I list my space?",
    answer:
      "1. Go to your Listings page\n2. Click 'Add New Listing'\n3. Upload photos of your space\n4. Select the space type (Window Poster, Bulletin Board, etc.)\n5. Set your dimensions and pricing\n6. Add your location\n7. Publish your listing\n\nOnce published, advertisers can discover and book your space!",
    category: "space-owner",
  },
  {
    id: "so-2",
    question: "How much can I earn from my space?",
    answer:
      "Earnings depend on your space type, location, and pricing. Space owners typically earn $50-200 per week per space. You set your own price per week, and Elaview takes a 15% platform fee. You also receive a print/install fee ($10-35) when you download the creative file.",
    category: "space-owner",
  },
  {
    id: "so-3",
    question: "What are the print and installation requirements?",
    answer:
      "You're responsible for printing and installing the creative locally. Most space owners use local print shops (FedEx, Staples, etc.) and install themselves. The print/install fee covers these costs. We provide guidelines for proper installation in your booking details.",
    category: "space-owner",
  },
  {
    id: "so-4",
    question: "How do I upload verification photos?",
    answer:
      "After installing the creative:\n1. Go to your booking details page\n2. Click 'Upload Verification Photos'\n3. Take 3 photos using the in-app camera:\n   - Wide shot showing the full installation\n   - Close-up of the creative\n   - Angle shot showing context\n4. Submit for review\n\nPhotos must be taken within 100 meters of your listing location (GPS verified).",
    category: "space-owner",
  },
  {
    id: "so-5",
    question: "When do I get paid?",
    answer:
      "Payments are split into two stages:\n• Stage 1 (File Download): You receive the print/install fee immediately when you download the creative file\n• Stage 2 (Approval): You receive the remainder when the advertiser approves the installation (or after 48 hours auto-approval)\n\nPayments are processed via Stripe Connect to your bank account.",
    category: "space-owner",
  },

  // Billing FAQs
  {
    id: "bill-1",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through Stripe. Payments are processed securely and held in escrow until the booking is completed.",
    category: "billing",
  },
  {
    id: "bill-2",
    question: "What fees does Elaview charge?",
    answer:
      "For Advertisers:\n• Platform fee: 15% of the booking total\n• Print/Install fee: $10-35 (varies by space type)\n\nFor Space Owners:\n• Platform fee: 15% of the booking total (deducted from your earnings)\n• Stripe Connect fees: Standard payment processing fees apply",
    category: "billing",
  },
  {
    id: "bill-3",
    question: "How do refunds work?",
    answer:
      "Refunds depend on the booking status:\n• Before file download: Full refund\n• After file download: Print/install fee kept by owner, remainder refunded\n• After installation: No refund (unless dispute is resolved in your favor)\n\nRefunds are processed within 5-7 business days to your original payment method.",
    category: "billing",
  },
  {
    id: "bill-4",
    question: "Can I get a receipt for my booking?",
    answer:
      "Yes! You can download receipts from your booking details page or the Spendings page. Receipts include all payment details, booking information, and are suitable for tax purposes.",
    category: "billing",
  },

  // Account FAQs
  {
    id: "acc-1",
    question: "How do I update my profile information?",
    answer:
      "Go to Settings > Profile to update your name, email, phone number, and avatar. For company information (advertisers) or business details (space owners), use the respective tabs in Settings.",
    category: "account",
  },
  {
    id: "acc-2",
    question: "How do I change my notification preferences?",
    answer:
      "Go to Settings > Notifications. You can toggle notifications for different events (booking updates, payments, messages) and choose whether to receive them in-app, via email, or push notifications.",
    category: "account",
  },
  {
    id: "acc-3",
    question: "How do I delete my account?",
    answer:
      "To delete your account, contact our support team at support@elaview.com. Please note that you must complete or cancel all active bookings before account deletion. We'll process your request within 7 business days.",
    category: "account",
  },
];

export default function HelpPage() {
  const faqsByCategory = {
    "getting-started": allFAQs.filter((f) => f.category === "getting-started"),
    advertiser: allFAQs.filter((f) => f.category === "advertiser"),
    "space-owner": allFAQs.filter((f) => f.category === "space-owner"),
    billing: allFAQs.filter((f) => f.category === "billing"),
    account: allFAQs.filter((f) => f.category === "account"),
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 space-y-4 text-center">
        <div className="flex justify-center">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <HelpCircle className="text-primary h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Find answers to common questions and learn how to get the most out of
          Elaview
        </p>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <QuickLinks />
      </div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        <FAQSection
          title="Getting Started"
          faqs={faqsByCategory["getting-started"]}
          defaultOpen={true}
        />

        <FAQSection
          title="For Advertisers"
          faqs={faqsByCategory.advertiser}
          defaultOpen={true}
        />

        <FAQSection
          title="For Space Owners"
          faqs={faqsByCategory["space-owner"]}
          defaultOpen={true}
        />

        <FAQSection
          title="Billing & Payments"
          faqs={faqsByCategory.billing}
          defaultOpen={true}
        />

        <FAQSection
          title="Account & Settings"
          faqs={faqsByCategory.account}
          defaultOpen={true}
        />
      </div>

      {/* Contact Support */}
      <div className="mt-12">
        <ContactSupport />
      </div>
    </div>
  );
}
