"use client";

import React, { useState } from "react";

export type TField =
  | "sectionName"
  | "sectionType"
  | "reviewer"
  | "target"
  | "limit";

export type TInputSection = {
  sectionName: string;
  sectionType: string;
  reviewer: string;
  target: string;
  limit: string;
};


function InputSectionModal({
  render,
}: {
  render: ({
    formData,
    handleInputChange,
    handleSubmission,
    handleCancel,
  }: {
    formData: TInputSection;
    handleInputChange: (field: TField, value: string) => void;
    handleSubmission: (e: React.FormEvent<HTMLFormElement>) => void;
    handleCancel: () => void;
  }) => React.ReactNode;
}) {
  const [formData, setFormData] = useState({
    sectionName: "",
    sectionType: "",
    reviewer: "",
    target: "",
    limit: "",
  });

  const handleCancel = () => {
    setFormData({
      sectionName: "",
      sectionType: "",
      reviewer: "",
      target: "",
      limit: "",
    });
    // setOpen(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSection = () => {
    if (!formData.sectionName.trim() || !formData.sectionType) {
      return;
    }
    // TODO: Implement add section logic
    console.log(formData);
    handleCancel();
  };

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.sectionName.trim() || !formData.sectionType) {
      return;
    }
    handleAddSection();
  };

  return render({
    formData,
    handleInputChange,
    handleSubmission,
    handleCancel,
  });
}

export default InputSectionModal;
