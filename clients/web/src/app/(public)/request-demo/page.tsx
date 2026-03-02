import {
  IconVideo,
  IconClockHour4,
  IconUsers,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Separator } from "@/components/primitives/separator";

const WHAT_TO_EXPECT = [
  {
    icon: IconClockHour4,
    title: "30-minute walkthrough",
    description:
      "A focused demo of the features most relevant to your use case — no filler.",
  },
  {
    icon: IconUsers,
    title: "Meet the team",
    description:
      "Talk directly with someone who knows the platform inside and out.",
  },
  {
    icon: IconVideo,
    title: "Live platform access",
    description:
      "We'll walk through a live environment so you can see exactly how it works.",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-16 md:py-24">
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          Request a Demo
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          See Elaview in action.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Schedule a personalized demo and we will show you exactly how Elaview
          can work for your business — whether you are an advertiser, a space
          owner, or both.
        </p>
      </section>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Demo Request Form */}
        <section>
          <h2 className="mb-6 text-xl font-semibold">Book your demo</h2>
          <form className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="company">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Acme Corp"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="phone">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="role">
                I am primarily a...
              </label>
              <select
                id="role"
                name="role"
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select one</option>
                <option value="advertiser">Advertiser / brand</option>
                <option value="space_owner">
                  Space owner / property manager
                </option>
                <option value="agency">Agency / consultant</option>
                <option value="both">Both advertiser and space owner</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="message">
                Anything you&apos;d like us to know?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us about your use case, goals, or questions..."
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Request demo
              </button>
            </div>
          </form>
        </section>

        {/* What to expect */}
        <section>
          <h2 className="mb-6 text-xl font-semibold">What to expect</h2>
          <div className="flex flex-col gap-6">
            {WHAT_TO_EXPECT.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="mb-0.5 font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">We will cover</h3>
            {[
              "Browsing and filtering ad spaces",
              "Creating and managing campaigns",
              "The booking and escrow flow",
              "Listing your own spaces and earning revenue",
              "Analytics and reporting",
              "Pricing and billing",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <IconCircleCheck className="text-primary size-4 shrink-0" />
                <span className="text-muted-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
