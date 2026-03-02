import Link from "next/link";
import api from "@/api/server";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  CAREER_DEPARTMENT_LABELS,
  CAREER_TYPE_LABELS,
  type CareerDepartment,
} from "@/lib/types/career";
import {
  IconBriefcase,
  IconMapPin,
  IconChevronRight,
} from "@tabler/icons-react";

export default async function Page() {
  const careers = await api.careers.list({ isActive: true });

  const byDepartment = careers.reduce(
    (acc, career) => {
      const dept = career.department as CareerDepartment;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(career);
      return acc;
    },
    {} as Record<CareerDepartment, typeof careers>
  );

  const departments = Object.keys(byDepartment) as CareerDepartment[];

  return (
    <div className="flex flex-col gap-24 py-16 md:py-24">
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
          Careers
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Help us build the future of local advertising.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          We are a small team with big ambitions. Join us in building the
          platform that connects local advertisers with the physical spaces that
          matter most to their communities.
        </p>
      </section>

      <Separator />

      {/* Why Elaview */}
      <section>
        <h2 className="mb-8 text-2xl font-bold">Why work at Elaview?</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Remote-first",
              description:
                "Work from anywhere. We trust you to get things done and we care about outcomes, not hours.",
            },
            {
              title: "Real impact",
              description:
                "Every feature you ship directly affects the advertisers and space owners who depend on our platform.",
            },
            {
              title: "Small team, big surface area",
              description:
                "You will own meaningful parts of the product and have real influence over how we build things.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Job listings */}
      <section>
        <h2 className="mb-8 text-2xl font-bold">Open positions</h2>

        {careers.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
              <IconBriefcase className="size-6" />
            </div>
            <div>
              <p className="font-semibold">No open positions right now</p>
              <p className="text-muted-foreground mt-1 text-sm">
                We are not actively hiring at the moment, but we are always
                interested in hearing from talented people.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {departments.map((dept) => (
              <div key={dept}>
                <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
                  {CAREER_DEPARTMENT_LABELS[dept]}
                </h3>
                <div className="flex flex-col divide-y">
                  {byDepartment[dept].map((career) => (
                    <Link
                      key={career.id}
                      href={`/careers/${career.id}`}
                      className="hover:bg-muted/50 group flex items-center justify-between rounded-lg px-4 py-4 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold group-hover:underline">
                          {career.title}
                        </span>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <IconMapPin className="size-3.5" />
                            {career.location}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {CAREER_TYPE_LABELS[career.type]}
                          </Badge>
                        </div>
                      </div>
                      <IconChevronRight className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* General CTA */}
      <section className="max-w-2xl">
        <h2 className="mb-3 text-xl font-semibold">
          Do not see a role that fits?
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          We are always open to hearing from talented people who share our
          mission. Send us a note and tell us how you could contribute.
        </p>
        <Button variant="outline" asChild>
          <Link href="/contact">Send us a note</Link>
        </Button>
      </section>
    </div>
  );
}
