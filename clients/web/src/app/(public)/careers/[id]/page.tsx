import { notFound } from "next/navigation";
import Link from "next/link";
import api from "@/api/server";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  CAREER_DEPARTMENT_LABELS,
  CAREER_TYPE_LABELS,
} from "@/lib/types/career";
import {
  IconArrowLeft,
  IconBuilding,
  IconMapPin,
  IconBriefcase,
} from "@tabler/icons-react";

export default async function Page({ params }: PageProps<"/careers/[id]">) {
  const { id } = await params;
  const career = await api.careers.detail(id);

  if (!career || !career.isActive) notFound();

  return (
    <div className="flex flex-col gap-10 py-16 md:py-24">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/careers">
            <IconArrowLeft className="mr-1 size-4" />
            All open positions
          </Link>
        </Button>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {CAREER_DEPARTMENT_LABELS[career.department]}
              </Badge>
              <Badge variant="outline">{CAREER_TYPE_LABELS[career.type]}</Badge>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              {career.title}
            </h1>
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <IconMapPin className="size-4" />
                {career.location}
              </span>
              <span className="flex items-center gap-1.5">
                <IconBriefcase className="size-4" />
                {CAREER_TYPE_LABELS[career.type]}
              </span>
              <span className="flex items-center gap-1.5">
                <IconBuilding className="size-4" />
                {CAREER_DEPARTMENT_LABELS[career.department]}
              </span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">About the role</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {career.description}
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              What we are looking for
            </h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {career.requirements}
            </div>
          </div>

          <Separator />

          {/* About Elaview */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">About Elaview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Elaview is a B2B marketplace connecting local advertisers with
              physical ad space owners — storefronts, windows, walls, and more.
              We are a small, remote-first team building the infrastructure for
              the next generation of local advertising.
            </p>
          </div>
        </div>

        {/* Apply sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-xl border p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Apply for this role</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Send us your resume and a short note about why you are excited
              about this role.
            </p>

            <Button className="w-full" asChild>
              <a
                href={`mailto:careers@elaview.com?subject=Application: ${encodeURIComponent(career.title)}`}
              >
                Apply via email
              </a>
            </Button>

            <p className="text-muted-foreground mt-4 text-xs">
              Send your resume and a short cover note to careers@elaview.com
              with the subject line &ldquo;Application: {career.title}&rdquo;.
              We review every application personally.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
