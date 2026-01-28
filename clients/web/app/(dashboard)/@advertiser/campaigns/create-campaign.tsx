"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Input } from "@/components/primitives/input";
import { cn } from "@/lib/utils";
import {
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { CAMPAIGN_STEPS } from "./constants";

export default function CreateCampaign() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <IconPlus />
        New Campaign
      </Button>

      <DialogContent
        size="xl"
        showCloseButton={false}
        className="h-[85vh] overflow-hidden p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>

        <div className="flex h-full min-h-0 flex-col">
          <StepIndicator currentStep={currentStep} />

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {currentStep === 1 && <DetailsStep />}
            {currentStep === 2 && <ScheduleStep />}
            {currentStep === 3 && <MediaStep />}
            {currentStep === 4 && <ReviewStep />}
          </div>

          <div className="flex items-center justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : goBack}
              className="gap-2"
            >
              {currentStep === 1 ? (
                <>
                  <IconX className="size-4" />
                  Cancel
                </>
              ) : (
                <>
                  <IconChevronLeft className="size-4" />
                  Back
                </>
              )}
            </Button>

            {currentStep < 4 ? (
              <Button onClick={goNext} className="gap-2">
                Continue
                <IconChevronRight className="size-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Create Campaign</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 border-b p-4">
      {CAMPAIGN_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isCompleted && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? "✓" : step.id}
            </div>
            <span
              className={cn(
                "hidden text-sm sm:block",
                isActive && "font-medium",
                !isActive && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {index < CAMPAIGN_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-8",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DetailsStep() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Campaign Details</h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your advertising campaign.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Campaign Name
          <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="e.g., Spring Sale 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
        <p className="text-muted-foreground text-right text-xs">
          {name.length}/100
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Description
          <span className="text-muted-foreground ml-1">(optional)</span>
        </label>
        <textarea
          className="border-input bg-background placeholder:text-muted-foreground min-h-24 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Describe what you want to achieve with this campaign..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <p className="text-muted-foreground text-right text-xs">
          {description.length}/500
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Campaign Goals</label>
        <Input
          placeholder="e.g., Increase brand awareness, drive foot traffic"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Target Audience</label>
        <Input
          placeholder="e.g., Young professionals, families, students"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />
      </div>
    </div>
  );
}

function ScheduleStep() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Budget & Schedule</h2>
        <p className="text-muted-foreground text-sm">
          Set your campaign budget and duration.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Total Budget
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            $
          </span>
          <Input placeholder="5000" className="pl-7" type="number" min={100} />
        </div>
        <p className="text-muted-foreground text-xs">
          Minimum budget is $100
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Start Date
            <span className="text-destructive">*</span>
          </label>
          <Input type="date" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            End Date
            <span className="text-destructive">*</span>
          </label>
          <Input type="date" />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium">Budget tips:</p>
        <ul className="text-muted-foreground mt-2 list-inside list-disc text-sm">
          <li>Longer campaigns get better visibility</li>
          <li>Higher budgets allow for more ad space bookings</li>
          <li>You only pay for confirmed bookings</li>
        </ul>
      </div>
    </div>
  );
}

function MediaStep() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Campaign Media</h2>
        <p className="text-muted-foreground text-sm">
          Upload your ad creative or campaign imagery.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((_, index) => (
          <div
            key={index}
            className="bg-muted relative aspect-square rounded-lg"
          >
            {index === 0 && (
              <span className="bg-primary text-primary-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs">
                Primary
              </span>
            )}
            <button
              className="bg-background absolute top-2 right-2 rounded-full p-1"
              onClick={() => setPhotos(photos.filter((__, i) => i !== index))}
            >
              <IconX className="size-4" />
            </button>
          </div>
        ))}

        {photos.length < 3 && (
          <button className="border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors">
            <IconCamera className="size-8" />
            <span className="text-sm">Add Image</span>
          </button>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium">Image requirements:</p>
        <ul className="text-muted-foreground mt-2 list-inside list-disc text-sm">
          <li>High resolution images (minimum 1200x628px)</li>
          <li>PNG or JPG format</li>
          <li>Max file size: 5MB per image</li>
          <li>No text covering more than 20% of the image</li>
        </ul>
      </div>
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Review Campaign</h2>
        <p className="text-muted-foreground text-sm">
          Review your campaign details before creating.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ReviewSection title="Details">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Spring Sale 2026</p>
            <p className="text-muted-foreground text-sm">
              Promoting our spring collection across local storefronts...
            </p>
          </div>
        </ReviewSection>

        <ReviewSection title="Budget & Schedule">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-xs">Budget</p>
              <p className="text-lg font-semibold">$5,000</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Start</p>
              <p className="text-lg font-semibold">Feb 1</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">End</p>
              <p className="text-lg font-semibold">Mar 31</p>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Media">
          <div className="flex gap-2 overflow-x-auto">
            <div className="bg-muted size-24 shrink-0 rounded-lg" />
          </div>
        </ReviewSection>
      </div>

      <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-4">
        <span className="text-muted-foreground text-sm">
          By creating this campaign, you agree to our Terms of Service and
          Advertising Guidelines.
        </span>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </div>
      {children}
    </div>
  );
}
