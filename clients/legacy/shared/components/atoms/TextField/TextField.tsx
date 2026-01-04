"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import { inputVariants } from "./TextField.styled";


const label = {
  htmlFor:'text',
  label:'string',
  style:'block'
}

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  errorMessage?: string;
  htmlFor?: string;
  label?: string;
  icon?: LucideIcon;
}

function TextField({
  variant,
  size,
  htmlFor,
  label,
  errorMessage,
  icon: Icon,
  ...rest
}: TextFieldProps) {
  const hasIcon = !!Icon;
  const paddingLeft = hasIcon ? "pl-10" : "pl-3";

  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-500" />
          </div>
        )}
        <input
          type="text"
          className={cn(inputVariants({ variant, size }))}
          {...rest}
        />
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default TextField;
