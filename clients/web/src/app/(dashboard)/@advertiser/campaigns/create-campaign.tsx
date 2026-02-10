"use client";

import { ReactNode, useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/button";
import Modal from "@/components/composed/modal";
import { Input } from "@/components/primitives/input";
import { cn } from "@/lib/utils";
import {
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { CAMPAIGN_STEPS } from "./constants";
import {
  detailsStepSchema,
  scheduleStepSchema,
  mediaStepSchema,
  type CreateCampaignFormData,
} from "./schemas";
import {
  createCampaignAction,
  type CreateCampaignState,
} from "./campaigns.actions";
import { toast } from "sonner";
import env from "@/lib/env";
import Image from "next/image";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import storage from "@/lib/storage";

type FormData = Partial<CreateCampaignFormData>;

const initialState: CreateCampaignState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const emptyFormData: FormData = {};

export default function CreateCampaign() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string[]>>({});

  const {
    value: formData,
    set: setFormData,
    remove: clearDraft,
  } = useLocalStorage<FormData>(storage.drafts.createCampaign, emptyFormData);

  const hasDraft =
    formData.name ||
    formData.description ||
    formData.imageUrl ||
    formData.totalBudget;

  const [state, action, pending] = useActionState(
    createCampaignAction,
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
    let result;

    switch (step) {
      case 1:
        result = detailsStepSchema.safeParse({
          name: formData.name,
          description: formData.description,
          goals: formData.goals,
          targetAudience: formData.targetAudience,
        });
        break;
      case 2:
        result = scheduleStepSchema.safeParse({
          totalBudget: formData.totalBudget,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        break;
      case 3:
        result = mediaStepSchema.safeParse({
          imageUrl: formData.imageUrl,
        });
        break;
      default:
        return true;
    }

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
      setCurrentStep((s) => Math.min(s + 1, 4));
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

  const handleCreate = () => {
    clearDraft();
    const fd = new window.FormData();
    fd.append("name", formData.name ?? "");
    fd.append("description", formData.description ?? "");
    fd.append("goals", formData.goals ?? "");
    fd.append("targetAudience", formData.targetAudience ?? "");
    fd.append("totalBudget", String(formData.totalBudget ?? ""));
    fd.append("startDate", formData.startDate ?? "");
    fd.append("endDate", formData.endDate ?? "");
    fd.append("imageUrl", formData.imageUrl ?? "");

    action(fd);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus />
        New Campaign
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Create New Campaign"
        srOnly
        size="xl"
        showCloseButton={false}
        className="h-[85vh] overflow-hidden p-0"
      >
        <div className="flex h-full min-h-0 flex-col">
          <StepIndicator currentStep={currentStep} />

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <DetailsStep
                name={formData.name ?? ""}
                description={formData.description ?? ""}
                goals={formData.goals ?? ""}
                targetAudience={formData.targetAudience ?? ""}
                onNameChange={(val) => updateFormData("name", val)}
                onDescriptionChange={(val) =>
                  updateFormData("description", val)
                }
                onGoalsChange={(val) => updateFormData("goals", val)}
                onTargetAudienceChange={(val) =>
                  updateFormData("targetAudience", val)
                }
                errors={stepErrors}
              />
            )}
            {currentStep === 2 && (
              <ScheduleStep
                totalBudget={formData.totalBudget}
                startDate={formData.startDate ?? ""}
                endDate={formData.endDate ?? ""}
                onBudgetChange={(val) => updateFormData("totalBudget", val)}
                onStartDateChange={(val) => updateFormData("startDate", val)}
                onEndDateChange={(val) => updateFormData("endDate", val)}
                errors={stepErrors}
              />
            )}
            {currentStep === 3 && (
              <MediaStep
                imageUrl={formData.imageUrl ?? ""}
                onChange={(url) => updateFormData("imageUrl", url)}
                errors={stepErrors.imageUrl}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep formData={formData} onEditStep={setCurrentStep} />
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
              {currentStep < 4 ? (
                <Button onClick={goNext} className="gap-2">
                  Continue
                  <IconChevronRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={pending}>
                  {pending && <IconLoader2 className="size-4 animate-spin" />}
                  {pending ? "Creating..." : "Create Campaign"}
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

type DetailsStepProps = {
  name: string;
  description: string;
  goals: string;
  targetAudience: string;
  onNameChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onGoalsChange: (val: string) => void;
  onTargetAudienceChange: (val: string) => void;
  errors: Record<string, string[]>;
};

function DetailsStep({
  name,
  description,
  goals,
  targetAudience,
  onNameChange,
  onDescriptionChange,
  onGoalsChange,
  onTargetAudienceChange,
  errors,
}: DetailsStepProps) {
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
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={100}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name[0]}</p>
        )}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
          onChange={(e) => onGoalsChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Target Audience</label>
        <Input
          placeholder="e.g., Young professionals, families, students"
          value={targetAudience}
          onChange={(e) => onTargetAudienceChange(e.target.value)}
        />
      </div>
    </div>
  );
}

type ScheduleStepProps = {
  totalBudget?: number;
  startDate: string;
  endDate: string;
  onBudgetChange: (val: number | undefined) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  errors: Record<string, string[]>;
};

function ScheduleStep({
  totalBudget,
  startDate,
  endDate,
  onBudgetChange,
  onStartDateChange,
  onEndDateChange,
  errors,
}: ScheduleStepProps) {
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
          <Input
            placeholder="5000"
            className="pl-7"
            type="number"
            min={100}
            value={totalBudget ?? ""}
            onChange={(e) =>
              onBudgetChange(
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>
        {errors.totalBudget && (
          <p className="text-destructive text-sm">{errors.totalBudget[0]}</p>
        )}
        <p className="text-muted-foreground text-xs">Minimum budget is $100</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Start Date
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          {errors.startDate && (
            <p className="text-destructive text-sm">{errors.startDate[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            End Date
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
          {errors.endDate && (
            <p className="text-destructive text-sm">{errors.endDate[0]}</p>
          )}
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

type MediaStepProps = {
  imageUrl: string;
  onChange: (url: string) => void;
  errors?: string[];
};

function MediaStep({ imageUrl, onChange, errors }: MediaStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const url = await uploadImage(files[0], "campaigns");
      onChange(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Campaign Media</h2>
        <p className="text-muted-foreground text-sm">
          Upload your ad creative or campaign imagery.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {errors && errors.length > 0 && (
        <p className="text-destructive text-sm">{errors[0]}</p>
      )}

      {imageUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt="Campaign creative"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <button
            type="button"
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1"
            onClick={() => onChange("")}
          >
            <IconX className="size-4 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <IconLoader2 className="size-8 animate-spin" />
          ) : (
            <IconCamera className="size-8" />
          )}
          <span className="text-sm">
            {uploading ? "Uploading..." : "Upload Creative"}
          </span>
        </button>
      )}

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

type ReviewStepProps = {
  formData: FormData;
  onEditStep: (step: number) => void;
};

function ReviewStep({ formData, onEditStep }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Review Campaign</h2>
        <p className="text-muted-foreground text-sm">
          Review your campaign details before creating.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ReviewSection title="Details" onEdit={() => onEditStep(1)}>
          <div className="flex flex-col gap-1">
            <p className="font-medium">{formData.name || "Untitled"}</p>
            {formData.description && (
              <p className="text-muted-foreground text-sm">
                {formData.description}
              </p>
            )}
            {formData.goals && (
              <p className="text-muted-foreground text-xs">
                Goals: {formData.goals}
              </p>
            )}
            {formData.targetAudience && (
              <p className="text-muted-foreground text-xs">
                Audience: {formData.targetAudience}
              </p>
            )}
          </div>
        </ReviewSection>

        <ReviewSection title="Budget & Schedule" onEdit={() => onEditStep(2)}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-xs">Budget</p>
              <p className="text-lg font-semibold">
                ${formData.totalBudget?.toLocaleString() ?? 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Start</p>
              <p className="text-lg font-semibold">
                {formData.startDate
                  ? new Date(
                      formData.startDate + "T00:00:00"
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">End</p>
              <p className="text-lg font-semibold">
                {formData.endDate
                  ? new Date(formData.endDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Media" onEdit={() => onEditStep(3)}>
          <div className="flex gap-2 overflow-x-auto">
            {formData.imageUrl ? (
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={formData.imageUrl}
                  alt="Campaign creative"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="bg-muted size-24 shrink-0 rounded-lg" />
            )}
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
