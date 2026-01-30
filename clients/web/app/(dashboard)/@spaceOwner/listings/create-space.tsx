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
  IconBuildingStore,
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconRuler,
  IconX,
} from "@tabler/icons-react";
import { DIMENSION_UNITS, SPACE_TYPES, STEPS } from "./constants";

export default function CreateSpace() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <IconPlus />
        New Space
      </Button>

      <DialogContent
        size="xl"
        showCloseButton={false}
        className="h-[85vh] overflow-hidden p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Space</DialogTitle>
        </DialogHeader>

        <div className="flex h-full min-h-0 flex-col">
          <StepIndicator currentStep={currentStep} />

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {currentStep === 1 && <PhotosStep />}
            {currentStep === 2 && <DetailsStep />}
            {currentStep === 3 && <LocationStep />}
            {currentStep === 4 && <PricingStep />}
            {currentStep === 5 && <PreviewStep />}
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

            {currentStep < 5 ? (
              <Button onClick={goNext} className="gap-2">
                Continue
                <IconChevronRight className="size-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Publish Listing</Button>
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
      {STEPS.map((step, index) => {
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
            {index < STEPS.length - 1 && (
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

function PhotosStep() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Add photos of your space</h2>
        <p className="text-muted-foreground text-sm">
          Upload 1-5 photos. The first photo will be your cover image.
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
                Cover
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

        {photos.length < 5 && (
          <button className="border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors">
            <IconCamera className="size-8" />
            <span className="text-sm">Add Photo</span>
          </button>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium">Tips for great photos:</p>
        <ul className="text-muted-foreground mt-2 list-inside list-disc text-sm">
          <li>Use natural lighting when possible</li>
          <li>Show the full space from multiple angles</li>
          <li>Include surrounding context for visibility</li>
          <li>Avoid blurry or dark images</li>
        </ul>
      </div>
    </div>
  );
}

function DetailsStep() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">What type of space is this?</h2>
        <p className="text-muted-foreground text-sm">
          Select the category that best describes your advertising space.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {SPACE_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
              selectedType === type.value
                ? "border-primary bg-primary/5 text-primary"
                : "hover:border-primary/50"
            )}
          >
            <IconBuildingStore className="size-6" />
            <span className="text-center text-xs">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Give your space a title
          <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="e.g., Downtown Coffee Shop Window"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        <p className="text-muted-foreground text-right text-xs">
          {title.length}/100
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Describe your space
          <span className="text-muted-foreground ml-1">(optional)</span>
        </label>
        <textarea
          className="border-input bg-background placeholder:text-muted-foreground min-h-24 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Tell advertisers about foot traffic, visibility, nearby landmarks..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <p className="text-muted-foreground text-right text-xs">
          {description.length}/500
        </p>
      </div>
    </div>
  );
}

function LocationStep() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Where is your space located?</h2>
        <p className="text-muted-foreground text-sm">
          Enter the address where your advertising space is located.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Street Address
            <span className="text-destructive">*</span>
          </label>
          <Input placeholder="123 Main Street" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            City
            <span className="text-destructive">*</span>
          </label>
          <Input placeholder="San Francisco" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              State
              <span className="text-destructive">*</span>
            </label>
            <Input placeholder="CA" maxLength={2} className="uppercase" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              ZIP Code
              <span className="text-destructive">*</span>
            </label>
            <Input placeholder="94102" />
          </div>
        </div>
      </div>

      <div className="bg-muted flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
        <span className="text-muted-foreground text-sm">
          Map preview will appear here
        </span>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium">Location tips:</p>
        <ul className="text-muted-foreground mt-2 list-inside list-disc text-sm">
          <li>Use the exact street address for accuracy</li>
          <li>Include suite/unit number if applicable</li>
          <li>Verify the location on the map preview</li>
        </ul>
      </div>
    </div>
  );
}

function PricingStep() {
  const [unit, setUnit] = useState("in");

  return (
    <div className="flex flex-col gap-6">
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold">Space Dimensions</h2>
        <p className="text-muted-foreground text-sm">
          Enter the size of your advertising space.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIMENSION_UNITS.map((u) => (
          <button
            key={u.value}
            onClick={() => setUnit(u.value)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm transition-colors",
              unit === u.value
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary/50"
            )}
          >
            {u.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium">
            Width
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <IconRuler className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input placeholder="48" className="pl-9" type="number" />
          </div>
        </div>

        <span className="text-muted-foreground mt-6">×</span>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium">
            Height
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <IconRuler className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 rotate-90" />
            <Input placeholder="36" className="pl-9" type="number" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Set your pricing</h2>
        <p className="text-muted-foreground text-sm">
          Set competitive rates to attract more advertisers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Daily Rate
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input placeholder="25" className="pl-7" type="number" min={5} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Weekly Rate</label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input placeholder="Auto" className="pl-7" type="number" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Monthly Rate</label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input placeholder="Auto" className="pl-7" type="number" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStep() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Review Your Listing</h2>
        <p className="text-muted-foreground text-sm">
          Make sure everything looks good before publishing.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PreviewSection title="Photos">
          <div className="flex gap-2 overflow-x-auto">
            <div className="bg-muted size-24 shrink-0 rounded-lg" />
            <div className="bg-muted size-24 shrink-0 rounded-lg" />
            <div className="bg-muted size-24 shrink-0 rounded-lg" />
          </div>
        </PreviewSection>

        <PreviewSection title="Details">
          <div className="flex flex-col gap-1">
            <span className="bg-muted text-muted-foreground w-fit rounded-full px-2 py-0.5 text-xs">
              Window Display
            </span>
            <p className="font-medium">Downtown Coffee Shop Window</p>
            <p className="text-muted-foreground text-sm">
              High-visibility window space in popular downtown coffee shop...
            </p>
          </div>
        </PreviewSection>

        <PreviewSection title="Location">
          <p className="text-sm">123 Main Street, San Francisco, CA 94102</p>
        </PreviewSection>

        <PreviewSection title="Pricing & Size">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-xs">Daily</p>
              <p className="text-lg font-semibold">$25</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Weekly</p>
              <p className="text-lg font-semibold">$150</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Monthly</p>
              <p className="text-lg font-semibold">$550</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            48 × 36 in
          </p>
        </PreviewSection>
      </div>

      <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-4">
        <span className="text-muted-foreground text-sm">
          By publishing, you agree to our Terms of Service and confirm that your
          listing information is accurate.
        </span>
      </div>
    </div>
  );
}

function PreviewSection({
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
