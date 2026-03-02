import Link from "next/link";
import api from "@/api/server";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import {
  CAREER_DEPARTMENT_LABELS,
  CAREER_TYPE_LABELS,
  type CareerDepartment,
  type CareerType,
} from "@/lib/types/career";
import { IconExternalLink } from "@tabler/icons-react";
import CreateCareer from "./create-career";

export default async function Page() {
  const careers = await api.careers.list();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Careers</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage open job positions listed on the public careers page.
          </p>
        </div>
        <CreateCareer />
      </div>

      {/* Backend pending notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30">
        <p className="font-medium text-amber-800 dark:text-amber-400">
          Backend integration pending
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-500">
          The Career entity has not yet been implemented in the .NET GraphQL
          API. All CRUD operations are stubbed. See{" "}
          <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-900">
            src/api/server/careers.ts
          </code>{" "}
          for the full backend contract to implement.
        </p>
      </div>

      {/* Table */}
      {careers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border py-16 text-center">
          <p className="font-semibold">No careers yet</p>
          <p className="text-muted-foreground text-sm">
            Create your first job posting to get started.
          </p>
          <CreateCareer triggerLabel="Create career" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {careers.map((career) => (
              <TableRow key={career.id}>
                <TableCell className="font-medium">{career.title}</TableCell>
                <TableCell>
                  {
                    CAREER_DEPARTMENT_LABELS[
                      career.department as CareerDepartment
                    ]
                  }
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {career.location}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {CAREER_TYPE_LABELS[career.type as CareerType]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={career.isActive ? "default" : "outline"}>
                    {career.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(career.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/careers/${career.id}`}>
                      <IconExternalLink className="size-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Link to public page */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Public careers page:</span>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <a href="/careers" target="_blank" rel="noopener noreferrer">
            /careers
            <IconExternalLink className="ml-1 size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
