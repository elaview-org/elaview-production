import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/primitives/card";
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
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-sm text-muted-foreground">
              support@elaview.com
            </p>
            <p className="text-xs text-muted-foreground">
              Response within 24 hours
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-muted-foreground">
              Available 9am - 5pm PST
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Start Chat
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Phone Support</h3>
            <p className="text-sm text-muted-foreground">
              (555) 123-4567
            </p>
            <p className="text-xs text-muted-foreground">
              Mon-Fri, 9am-5pm PST
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            For urgent matters, please call our support line or use live chat during business hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
