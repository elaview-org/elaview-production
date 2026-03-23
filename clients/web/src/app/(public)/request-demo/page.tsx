import {
  IconVideo,
  IconClockHour4,
  IconUsers,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Separator } from "@/components/primitives/separator";
import DemoRequestForm from "./demo-request-form";

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
          <DemoRequestForm />
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
