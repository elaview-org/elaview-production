"use client";

import {  ReactNode, useState } from "react";


function FormActions({ render }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    website: "",
    source: "GOOGLE_MAPS" as const,
    businessType: "OTHER" as const,
    location: "",
    hasInventory: "UNKNOWN" as "YES" | "NO" | "UNKNOWN",
    inventoryType: "" as any,
    estimatedSpaces: "",
    hasInstallCapability: "UNKNOWN" as "YES" | "NO" | "UNKNOWN",
    notes: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formData", formData);
  };
  return render({ formData, handleOnChange, handleSubmit });
}

export default FormActions;
