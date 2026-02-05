import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Button } from "@/components/primitives/button";
import { Mail, MessageSquare, Phone } from "lucide-react";

export function ContactSupport() {
  return (
    <Card id="contact">
      <CardHeader>
        <CardTitle className="text-2xl">Still Need Help?</CardTitle>
        <CardDescription>
          Our support team is here to help you with any questions or issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Mail className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-muted-foreground text-sm">support@elaview.com</p>
            <p className="text-muted-foreground text-xs">
              Response within 24 hours
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <MessageSquare className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-muted-foreground text-sm">
              Available 9am - 5pm PST
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Start Chat
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Phone className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold">Phone Support</h3>
            <p className="text-muted-foreground text-sm">(555) 123-4567</p>
            <p className="text-muted-foreground text-xs">
              Mon-Fri, 9am-5pm PST
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground text-center text-sm">
            For urgent matters, please call our support line or use live chat
            during business hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
