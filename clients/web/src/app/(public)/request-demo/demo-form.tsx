"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/primitives/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { IconCheck, IconSend } from "@tabler/icons-react";

export function DemoForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    role: "",
    locations: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: "",
        email: "",
        company: "",
        phone: "",
        role: "",
        locations: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <Card className="border-2 border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500 text-white">
              <IconCheck className="size-8" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                Demo Request Received!
              </h3>
              <p className="text-muted-foreground">
                Thank you for your interest. We&apos;ll contact you within 24
                hours to schedule your demo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name *</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email Address *</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="company">Company / Business Name *</FieldLabel>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Your Business Name"
            value={formState.company}
            onChange={(e) =>
              setFormState({ ...formState, company: e.target.value })
            }
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formState.phone}
            onChange={(e) =>
              setFormState({ ...formState, phone: e.target.value })
            }
          />
          <FieldDescription>
            Optional - we&apos;ll use email if not provided
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="role">I&apos;m interested in *</FieldLabel>
          <select
            id="role"
            name="role"
            value={formState.role}
            onChange={(e) =>
              setFormState({ ...formState, role: e.target.value })
            }
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            required
          >
            <option value="">Select an option</option>
            <option value="advertiser">Advertising my business</option>
            <option value="space-owner">Monetizing my space</option>
            <option value="both">Both</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="locations">
            {formState.role === "advertiser" || formState.role === "both"
              ? "Number of Business Locations"
              : formState.role === "space-owner"
                ? "Number of Available Spaces"
                : "Number of Locations/Spaces"}
          </FieldLabel>
          <Input
            id="locations"
            name="locations"
            type="text"
            placeholder="e.g., 1-3 locations"
            value={formState.locations}
            onChange={(e) =>
              setFormState({
                ...formState,
                locations: e.target.value,
              })
            }
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="preferredDate">Preferred Date</FieldLabel>
            <Input
              id="preferredDate"
              name="preferredDate"
              type="date"
              value={formState.preferredDate}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  preferredDate: e.target.value,
                })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="preferredTime">Preferred Time</FieldLabel>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formState.preferredTime}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  preferredTime: e.target.value,
                })
              }
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select time</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 7 PM)</option>
            </select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="message">Additional Information</FieldLabel>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us about your specific needs or questions..."
            rows={4}
            value={formState.message}
            onChange={(e) =>
              setFormState({ ...formState, message: e.target.value })
            }
          />
          <FieldDescription>
            Optional - help us tailor the demo to your needs
          </FieldDescription>
        </Field>

        <Field>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>Scheduling...</>
            ) : (
              <>
                Request Demo
                <IconSend className="ml-2 size-4" />
              </>
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
