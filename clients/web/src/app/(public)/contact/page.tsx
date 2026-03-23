import { IconMail, IconClock, IconMapPin } from "@tabler/icons-react";
import { Separator } from "@/components/primitives/separator";
import ContactForm from "./contact-form";

const CONTACT_INFO = [
  {
    icon: IconMail,
    title: "Email us",
    detail: "hello@elaview.com",
    sub: "We respond within 1 business day.",
  },
  {
    icon: IconClock,
    title: "Office hours",
    detail: "Mon – Fri, 9am – 6pm PST",
    sub: "Support is available outside these hours for urgent issues.",
  },
  {
    icon: IconMapPin,
    title: "Headquarters",
    detail: "San Francisco, CA",
    sub: "Remote-first team.",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-16 md:py-24">
      {/* Hero */}
      <section className="max-w-2xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          Contact
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Get in touch.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Whether you have a question about pricing, a platform issue, or just
          want to explore how Elaview can work for your business — we are here.
        </p>
      </section>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Contact Form */}
        <section>
          <h2 className="mb-6 text-xl font-semibold">Send us a message</h2>
          <ContactForm />
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="mb-6 text-xl font-semibold">Other ways to reach us</h2>
          <div className="flex flex-col gap-6">
            {CONTACT_INFO.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="mb-0.5 font-semibold">{item.title}</h3>
                  <p className="text-sm font-medium">{item.detail}</p>
                  <p className="text-muted-foreground text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div>
            <h3 className="mb-2 font-semibold">Looking for support?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have a question about an active booking or account issue,
              please log in and use the in-platform messaging feature for the
              fastest response.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
