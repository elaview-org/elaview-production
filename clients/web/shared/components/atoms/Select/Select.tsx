"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value"
  > {
  errorMessage?: string;
  htmlFor?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon?: LucideIcon;
  wrapperClassName?: string;
  selectClassName?: string;
  options: SelectOption[];
  placeholder?: string;
}

function Select({
  errorMessage,
  htmlFor,
  label,
  onChange,
  value,
  icon: Icon,
  wrapperClassName = "",
  selectClassName = "",
  className,
  disabled,
  options,
  placeholder = "Select an option",
  ...rest
}: SelectProps) {
  const hasIcon = !!Icon;
  const paddingLeft = hasIcon ? "pl-12" : "pl-4";

  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className={`relative ${wrapperClassName}`}>
        {Icon && (
          <div className="absolute top-4 left-4 pointer-events-none">
            <Icon className="h-5 w-5 text-slate-500 transition-colors" />
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full ${paddingLeft} pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName} ${
            className || ""
          }`}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default Select;
