"use client";

import { ReactNode, useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/button";
import Modal from "@/components/composed/modal";
import { Input } from "@/components/primitives/input";
import { cn } from "@/lib/utils";
import {
  IconBuildingStore,
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconPlus,
  IconRuler,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DIMENSION_UNITS, SPACE_TYPES, STEPS } from "./constants";
import { SpaceType } from "@/types/gql";
import {
  photosStepSchema,
  detailsStepSchema,
  locationStepSchema,
  pricingStepSchema,
  type CreateSpaceFormData,
} from "./schemas";
import { createSpaceAction, type CreateSpaceState } from "./listings.actions";
import { toast } from "sonner";
import env from "@/lib/env";
import Image from "next/image";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import storage from "@/lib/storage";

type FormData = Partial<CreateSpaceFormData>;

const initialState: CreateSpaceState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const emptyFormData: FormData = {
  images: [],
  minDuration: 1,
};

export default function CreateSpace() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string[]>>({});

  const {
    value: formData,
    set: setFormData,
    remove: clearDraft,
  } = useLocalStorage<FormData>(storage.drafts.createSpace, emptyFormData);

  const hasDraft =
    formData.title ||
    formData.description ||
    formData.address ||
    (formData.images && formData.images.length > 0) ||
    formData.type;

  const [state, action, pending] = useActionState(
    createSpaceAction,
    initialState
  );

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (stepErrors[key]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    let schema;
    let data: Partial<FormData>;

    switch (step) {
      case 1:
        schema = photosStepSchema;
        data = { images: formData.images };
        break;
      case 2:
        schema = detailsStepSchema;
        data = {
          type: formData.type,
          title: formData.title,
          description: formData.description,
        };
        break;
      case 3:
        schema = locationStepSchema;
        data = {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        };
        break;
      case 4:
        schema = pricingStepSchema;
        data = {
          width: formData.width,
          height: formData.height,
          pricePerDay: formData.pricePerDay,
          installationFee: formData.installationFee,
          minDuration: formData.minDuration,
          maxDuration: formData.maxDuration,
        };
        break;
      default:
        return true;
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      setStepErrors(
        result.error.flatten().fieldErrors as Record<string, string[]>
      );
      return false;
    }
    setStepErrors({});
    return true;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
    setStepErrors({});
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setCurrentStep(1);
    setStepErrors({});
    setOpen(false);
  };

  const handlePublish = () => {
    clearDraft();
    const fd = new window.FormData();
    fd.append("images", JSON.stringify(formData.images ?? []));
    fd.append("type", formData.type ?? "");
    fd.append("title", formData.title ?? "");
    fd.append("description", formData.description ?? "");
    fd.append("address", formData.address ?? "");
    fd.append("city", formData.city ?? "");
    fd.append("state", formData.state ?? "");
    fd.append("zipCode", formData.zipCode ?? "");
    fd.append("pricePerDay", String(formData.pricePerDay ?? ""));
    fd.append("installationFee", String(formData.installationFee ?? ""));
    fd.append("minDuration", String(formData.minDuration ?? 1));
    fd.append("maxDuration", String(formData.maxDuration ?? ""));
    fd.append("width", String(formData.width ?? ""));
    fd.append("height", String(formData.height ?? ""));

    action(fd);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus />
        New Space
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Create New Space"
        srOnly
        size="xl"
        showCloseButton={false}
        className="h-[85vh] overflow-hidden p-0"
      >
        <div className="flex h-full min-h-0 flex-col">
          <StepIndicator currentStep={currentStep} />

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <PhotosStep
                photos={formData.images ?? []}
                onChange={(images) => updateFormData("images", images)}
                errors={stepErrors.images}
              />
            )}
            {currentStep === 2 && (
              <DetailsStep
                selectedType={formData.type}
                title={formData.title ?? ""}
                description={formData.description ?? ""}
                onTypeChange={(type) => updateFormData("type", type)}
                onTitleChange={(title) => updateFormData("title", title)}
                onDescriptionChange={(desc) =>
                  updateFormData("description", desc)
                }
                errors={stepErrors}
              />
            )}
            {currentStep === 3 && (
              <LocationStep
                address={formData.address ?? ""}
                city={formData.city ?? ""}
                stateVal={formData.state ?? ""}
                zipCode={formData.zipCode ?? ""}
                onAddressChange={(val) => updateFormData("address", val)}
                onCityChange={(val) => updateFormData("city", val)}
                onStateChange={(val) => updateFormData("state", val)}
                onZipCodeChange={(val) => updateFormData("zipCode", val)}
                errors={stepErrors}
              />
            )}
            {currentStep === 4 && (
              <PricingStep
                width={formData.width}
                height={formData.height}
                pricePerDay={formData.pricePerDay}
                installationFee={formData.installationFee}
                minDuration={formData.minDuration}
                maxDuration={formData.maxDuration}
                onWidthChange={(val) => updateFormData("width", val)}
                onHeightChange={(val) => updateFormData("height", val)}
                onPricePerDayChange={(val) =>
                  updateFormData("pricePerDay", val)
                }
                onInstallationFeeChange={(val) =>
                  updateFormData("installationFee", val)
                }
                onMinDurationChange={(val) =>
                  updateFormData("minDuration", val)
                }
                onMaxDurationChange={(val) =>
                  updateFormData("maxDuration", val)
                }
                errors={stepErrors}
              />
            )}
            {currentStep === 5 && (
              <PreviewStep formData={formData} onEditStep={setCurrentStep} />
            )}
          </div>

          <div className="flex items-center justify-between border-t p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? handleClose : goBack}
                className="gap-2"
                disabled={pending}
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
              {hasDraft && currentStep === 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscardDraft}
                  disabled={pending}
                  className="text-muted-foreground"
                >
                  <IconTrash className="size-4" />
                  Discard Draft
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {hasDraft && (
                <span className="text-muted-foreground text-xs">
                  Draft saved
                </span>
              )}
              {currentStep < 5 ? (
                <Button onClick={goNext} className="gap-2">
                  Continue
                  <IconChevronRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={handlePublish} disabled={pending}>
                  {pending && <IconLoader2 className="size-4 animate-spin" />}
                  {pending ? "Publishing..." : "Publish Listing"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
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

type PhotosStepProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
  errors?: string[];
};

function PhotosStep({ photos, onChange, errors }: PhotosStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= 5) break;

      try {
        const url = await uploadImage(file, "spaces");
        newPhotos.push(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      }
    }

    onChange(newPhotos);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Add photos of your space</h2>
        <p className="text-muted-foreground text-sm">
          Upload 1-5 photos. The first photo will be your cover image.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {errors && errors.length > 0 && (
        <p className="text-destructive text-sm">{errors[0]}</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={url}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="33vw"
            />
            {index === 0 && (
              <span className="bg-primary text-primary-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs">
                Cover
              </span>
            )}
            <button
              type="button"
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1"
              onClick={() => handleRemove(index)}
            >
              <IconX className="size-4 text-white" />
            </button>
          </div>
        ))}

        {photos.length < 5 && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <IconLoader2 className="size-8 animate-spin" />
            ) : (
              <IconCamera className="size-8" />
            )}
            <span className="text-sm">
              {uploading ? "Uploading..." : "Add Photo"}
            </span>
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

type DetailsStepProps = {
  selectedType?: SpaceType;
  title: string;
  description: string;
  onTypeChange: (type: SpaceType) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  errors: Record<string, string[]>;
};

function DetailsStep({
  selectedType,
  title,
  description,
  onTypeChange,
  onTitleChange,
  onDescriptionChange,
  errors,
}: DetailsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">What type of space is this?</h2>
        <p className="text-muted-foreground text-sm">
          Select the category that best describes your advertising space.
        </p>
      </div>

      {errors.type && (
        <p className="text-destructive text-sm">{errors.type[0]}</p>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {SPACE_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onTypeChange(type.value as SpaceType)}
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
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title[0]}</p>
        )}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          maxLength={500}
        />
        <p className="text-muted-foreground text-right text-xs">
          {description.length}/500
        </p>
      </div>
    </div>
  );
}

type LocationStepProps = {
  address: string;
  city: string;
  stateVal: string;
  zipCode: string;
  onAddressChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onStateChange: (val: string) => void;
  onZipCodeChange: (val: string) => void;
  errors: Record<string, string[]>;
};

function LocationStep({
  address,
  city,
  stateVal,
  zipCode,
  onAddressChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  errors,
}: LocationStepProps) {
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
          <Input
            placeholder="123 Main Street"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
          {errors.address && (
            <p className="text-destructive text-sm">{errors.address[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            City
            <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="San Francisco"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
          {errors.city && (
            <p className="text-destructive text-sm">{errors.city[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              State
              <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="CA"
              maxLength={2}
              className="uppercase"
              value={stateVal}
              onChange={(e) => onStateChange(e.target.value.toUpperCase())}
            />
            {errors.state && (
              <p className="text-destructive text-sm">{errors.state[0]}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">ZIP Code</label>
            <Input
              placeholder="94102"
              value={zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
            />
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

type PricingStepProps = {
  width?: number;
  height?: number;
  pricePerDay?: number;
  installationFee?: number;
  minDuration?: number;
  maxDuration?: number;
  onWidthChange: (val: number | undefined) => void;
  onHeightChange: (val: number | undefined) => void;
  onPricePerDayChange: (val: number | undefined) => void;
  onInstallationFeeChange: (val: number | undefined) => void;
  onMinDurationChange: (val: number | undefined) => void;
  onMaxDurationChange: (val: number | undefined) => void;
  errors: Record<string, string[]>;
};

function PricingStep({
  width,
  height,
  pricePerDay,
  installationFee,
  minDuration,
  maxDuration,
  onWidthChange,
  onHeightChange,
  onPricePerDayChange,
  onInstallationFeeChange,
  onMinDurationChange,
  onMaxDurationChange,
  errors,
}: PricingStepProps) {
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
            type="button"
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
          <label className="text-sm font-medium">Width</label>
          <div className="relative">
            <IconRuler className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="48"
              className="pl-9"
              type="number"
              value={width ?? ""}
              onChange={(e) =>
                onWidthChange(
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        <span className="text-muted-foreground mt-6">×</span>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium">Height</label>
          <div className="relative">
            <IconRuler className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 rotate-90" />
            <Input
              placeholder="36"
              className="pl-9"
              type="number"
              value={height ?? ""}
              onChange={(e) =>
                onHeightChange(
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Set your pricing</h2>
        <p className="text-muted-foreground text-sm">
          Set competitive rates to attract more advertisers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Daily Rate
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input
              placeholder="25"
              className="pl-7"
              type="number"
              min={1}
              value={pricePerDay ?? ""}
              onChange={(e) =>
                onPricePerDayChange(
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
          {errors.pricePerDay && (
            <p className="text-destructive text-sm">{errors.pricePerDay[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Installation Fee</label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input
              placeholder="Optional"
              className="pl-7"
              type="number"
              min={0}
              value={installationFee ?? ""}
              onChange={(e) =>
                onInstallationFeeChange(
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Min Duration (days)</label>
          <Input
            type="number"
            min={1}
            value={minDuration ?? 1}
            onChange={(e) =>
              onMinDurationChange(
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Max Duration (days)</label>
          <Input
            type="number"
            placeholder="No limit"
            value={maxDuration ?? ""}
            onChange={(e) =>
              onMaxDurationChange(
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

type PreviewStepProps = {
  formData: FormData;
  onEditStep: (step: number) => void;
};

function PreviewStep({ formData, onEditStep }: PreviewStepProps) {
  const typeLabel =
    SPACE_TYPES.find((t) => t.value === formData.type)?.label ?? formData.type;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Review Your Listing</h2>
        <p className="text-muted-foreground text-sm">
          Make sure everything looks good before publishing.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PreviewSection title="Photos" onEdit={() => onEditStep(1)}>
          <div className="flex gap-2 overflow-x-auto">
            {formData.images?.map((url, index) => (
              <div
                key={index}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ))}
            {(!formData.images || formData.images.length === 0) && (
              <div className="bg-muted size-24 shrink-0 rounded-lg" />
            )}
          </div>
        </PreviewSection>

        <PreviewSection title="Details" onEdit={() => onEditStep(2)}>
          <div className="flex flex-col gap-1">
            <span className="bg-muted text-muted-foreground w-fit rounded-full px-2 py-0.5 text-xs">
              {typeLabel}
            </span>
            <p className="font-medium">{formData.title || "Untitled"}</p>
            {formData.description && (
              <p className="text-muted-foreground text-sm">
                {formData.description}
              </p>
            )}
          </div>
        </PreviewSection>

        <PreviewSection title="Location" onEdit={() => onEditStep(3)}>
          <p className="text-sm">
            {formData.address}, {formData.city}, {formData.state}{" "}
            {formData.zipCode}
          </p>
        </PreviewSection>

        <PreviewSection title="Pricing & Size" onEdit={() => onEditStep(4)}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-xs">Daily Rate</p>
              <p className="text-lg font-semibold">
                ${formData.pricePerDay ?? 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Installation Fee</p>
              <p className="text-lg font-semibold">
                ${formData.installationFee ?? 0}
              </p>
            </div>
          </div>
          {(formData.width || formData.height) && (
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {formData.width ?? "—"} × {formData.height ?? "—"} in
            </p>
          )}
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
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const sigResponse = await fetch(
    `${env.client.apiUrl}/api/storage/upload-signature`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ folder }),
    }
  );

  if (!sigResponse.ok) {
    throw new Error("Failed to get upload signature");
  }

  const sig = await sigResponse.json();

  const formData = new window.FormData();
  formData.append("file", file);
  formData.append("signature", sig.signature);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("api_key", sig.apiKey);
  if (sig.folder) formData.append("folder", sig.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const result = await uploadResponse.json();
  return result.secure_url;
}
