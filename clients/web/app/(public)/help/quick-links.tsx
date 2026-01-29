import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/primitives/card";
import {
  FileText,
  BookOpen,
  DollarSign,
  Settings,
  MessageSquare,
  Shield,
} from "lucide-react";

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const quickLinks: QuickLink[] = [
  {
    title: "Creative Guidelines",
    description: "Learn about file formats, sizes, and design requirements",
    href: "#",
    icon: FileText,
  },
  {
    title: "Booking FAQ",
    description: "Common questions about booking spaces and campaigns",
    href: "#",
    icon: BookOpen,
  },
  {
    title: "Billing FAQ",
    description: "Payment methods, refunds, and billing questions",
    href: "#",
    icon: DollarSign,
  },
  {
    title: "Account Settings",
    description: "Manage your profile, notifications, and preferences",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Contact Support",
    description: "Get help from our support team",
    href: "#contact",
    icon: MessageSquare,
  },
  {
    title: "Platform Terms",
    description: "Read our terms of service and privacy policy",
    href: "/terms-of-service",
    icon: Shield,
  },
];

export function QuickLinks() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Quick Links</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.title} href={link.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
