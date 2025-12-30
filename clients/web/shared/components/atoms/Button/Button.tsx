"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  icon?: LucideIcon;
  className:string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children,
  icon: Icon,
  className,
  ...props
}: ButtonProps) {

  return (
    <button className={className} {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
export default Button;
