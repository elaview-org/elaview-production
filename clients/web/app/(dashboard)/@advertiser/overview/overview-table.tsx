"use client";

import { DataTable, schema } from "@/components/composed/data-table";
import Modal from "@/components/composed/modal";
import { useState } from "react";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { Button } from "@/components/primitives/button";
import InputSectionModal from "./input-section-modal";

const SECTION_TYPES = ["Header", "Content", "Metrics", "Custom"] as const;

const REVIEWERS = [
  "Eddie Lake",
  "Jamik Tashpulatov",
  "Maya Johnson",
  "Carlos Rodriguez",
  "Sarah Chen",
  "Raj Patel",
  "Leila Ahmadi",
  "Thomas Wilson",
  "Sophia Martinez",
  "Alex Thompson",
  "Nina Patel",
  "David Kim",
  "Maria Garcia",
  "James Wilson",
  "Priya Singh",
  "Sarah Johnson",
  "Michael Chen",
  "Lisa Wong",
  "Daniel Park",
  "Assign reviewer",
] as const;

function OverviewTable({ data }: { data: z.infer<typeof schema>[] }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <DataTable data={data} handleAddSectionAction={() => setOpen(true)} />
      <Modal open={open} onOpenChange={setOpen} title="Add New Section">
        <InputSectionModal
          render={({
            formData,
            handleInputChange,
            handleSubmission,
            handleCancel,
          }) => {
            return (
              <form onSubmit={handleSubmission}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="section-name">Section Name</FieldLabel>
                    <Input
                      id="section-name"
                      type="text"
                      value={formData.sectionName}
                      onChange={(e) =>
                        handleInputChange("sectionName", e.target.value)
                      }
                      placeholder="Enter section name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="section-type">Section Type</FieldLabel>
                    <Select
                      value={formData.sectionType}
                      onValueChange={(value) =>
                        handleInputChange("sectionType", value)
                      }
                    >
                      <SelectTrigger id="section-type" className="w-full">
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="reviewer">
                      Reviewer
                      <span className="text-muted-foreground ml-1 font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Select
                      value={formData.reviewer}
                      onValueChange={(value) =>
                        handleInputChange("reviewer", value)
                      }
                    >
                      <SelectTrigger id="reviewer" className="w-full">
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEWERS.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="target">
                      Target
                      <span className="text-muted-foreground ml-1 font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id="target"
                      type="number"
                      value={formData.target}
                      onChange={(e) =>
                        handleInputChange("target", e.target.value)
                      }
                      placeholder="Enter target"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="limit">
                      Limit
                      <span className="text-muted-foreground ml-1 font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id="limit"
                      type="number"
                      value={formData.limit}
                      onChange={(e) =>
                        handleInputChange("limit", e.target.value)
                      }
                      placeholder="Enter limit"
                    />
                  </Field>

                  <Field>
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Section</Button>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            );
          }}
        />
      </Modal>
    </>
  );
}

export default OverviewTable;
