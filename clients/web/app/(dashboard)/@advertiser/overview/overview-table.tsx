"use client";

import { DataTable, schema } from "@/components/composed/data-table";
import Modal from "@/components/composed/modal";
import { useState } from "react";
import z from "zod";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { Button } from "@/components/primitives/button";

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
  const [sectionName, setSectionName] = useState("");
  const [sectionType, setSectionType] = useState<string>("");
  const [reviewer, setReviewer] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [limit, setLimit] = useState<string>("");

  const handleCancel = () => {
    setSectionName("");
    setSectionType("");
    setReviewer("");
    setTarget("");
    setLimit("");
    setOpen(false);
  };

  const handleAddSection = () => {
    if (!sectionName.trim() || !sectionType) {
      return;
    }
    // TODO: Implement add section logic
    console.log({
      sectionName,
      sectionType,
      reviewer,
      target,
      limit,
    });
    handleCancel();
  };

  return (
    <>
      <DataTable data={data} handleAddSectionAction={() => setOpen(true)} />
      <Modal open={open} onOpenChange={setOpen} title="Add New Section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!sectionName.trim() || !sectionType) {
              return;
            }
            handleAddSection();
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="section-name">Section Name</FieldLabel>
              <Input
                id="section-name"
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Enter section name"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="section-type">Section Type</FieldLabel>
              <Select value={sectionType} onValueChange={setSectionType}>
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
              <Select value={reviewer} onValueChange={setReviewer}>
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
                value={target}
                onChange={(e) => setTarget(e.target.value)}
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
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter limit"
              />
            </Field>

            <Field>
              <div className="flex gap-3 justify-end">
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
      </Modal>
    </>
  );
}

export default OverviewTable;
