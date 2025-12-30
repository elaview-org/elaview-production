"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  errorMessage?: string;
  htmlFor?: string;
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  wrapperClassName?: string;
  inputClassName?: string;
}

function TextField({
  errorMessage,
  htmlFor,
  label,
  onChange,
  value,
  icon: Icon,
  wrapperClassName = "",
  inputClassName = "",
  className,
  disabled,
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
      <div className={`relative ${wrapperClassName}`}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-500" />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full ${paddingLeft} pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName} ${
            className || ""
          }`}
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
