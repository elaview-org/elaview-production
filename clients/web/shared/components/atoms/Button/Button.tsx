"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";


// className="px-2 py-1.5 text-emerald-400 hover:text-emerald-300 text-xs transition-colors flex items-center gap-1"
const buttonVariants = cva(
  "flex items-center gap-2 rounded-lg font-medium text-white",
  {
    variants: {
      variant: {
        default: "text-gray-300 hover:text-white transition-colors",
        primary:
          "bg-blue-600  transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
        outline: "border transition-all hover:shadow-md",
        grandient:
          "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25  shadow-lg transition-all duration-200 ",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-2",
      },
      backgroundColor: {
        gray: "bg-slate-700 hover:bg-slate-600 transition-colors",
        pink: "",
        purple: "bg-purple-600 hover:bg-purple-700 transition-colors",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      backgroundColor: "gray",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: LucideIcon;
}

function Button({
  className,
  size,
  variant,
  backgroundColor,
  icon: Icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, backgroundColor, className })
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {props.children}
    </button>
  );
}
export default Button;
