"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/primitives/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BreadcrumbContextValue = {
  labels: Map<string, string>;
  setLabel: (segment: string, label: string) => void;
  removeLabel: (segment: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
};

export function BreadcrumbProvider({ children }: ProviderProps) {
  const [labels, setLabels] = useState<Map<string, string>>(new Map());

  const setLabel = useCallback((segment: string, label: string) => {
    setLabels((prev) => {
      if (prev.get(segment) === label) return prev;
      const next = new Map(prev);
      next.set(segment, label);
      return next;
    });
  }, []);

  const removeLabel = useCallback((segment: string) => {
    setLabels((prev) => {
      if (!prev.has(segment)) return prev;
      const next = new Map(prev);
      next.delete(segment);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ labels, setLabel, removeLabel }),
    [labels, setLabel, removeLabel]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbLabel(segment: string, label: string | undefined) {
  const ctx = useContext(BreadcrumbContext);
  const setLabel = ctx?.setLabel;
  const removeLabel = ctx?.removeLabel;

  useLayoutEffect(() => {
    if (!setLabel || !removeLabel || !label) return;
    setLabel(segment, label);
    return () => removeLabel(segment);
  }, [setLabel, removeLabel, segment, label]);
}

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const ctx = useContext(BreadcrumbContext);
  const segments = buildSegments(pathname, ctx?.labels);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base font-medium">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <Fragment key={segment.url}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segment.url}>{segment.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const SEGMENT_LABELS: Record<string, string> = {
  overview: "Overview",
  bookings: "Bookings",
  listings: "Listings",
  messages: "Messages",
  analytics: "Analytics",
  earnings: "Earnings",
  spending: "Spending",
  settings: "Settings",
  profile: "Profile",
  notifications: "Notifications",
  calendar: "Calendar",
  discover: "Discover",
  campaigns: "Campaigns",
};

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type BreadcrumbSegment = {
  label: string;
  url: string;
};

function buildSegments(
  pathname: string,
  labels?: Map<string, string>
): BreadcrumbSegment[] {
  const parts = pathname.slice(1).split("/").filter(Boolean);

  return parts.map((part, index) => ({
    label: labels?.get(part) ?? SEGMENT_LABELS[part] ?? formatSegment(part),
    url: "/" + parts.slice(0, index + 1).join("/"),
  }));
}
