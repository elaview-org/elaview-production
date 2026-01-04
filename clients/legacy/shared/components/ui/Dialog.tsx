// src/components/ui/Dialog.tsx
"use client";

import * as React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onPointerDownOutside?: (e: any) => void;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog */}
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "", onPointerDownOutside }: DialogContentProps) {
  return (
    <div 
      className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-slate-900 p-6 shadow-xl border border-slate-700 ${className}`}
      onPointerDown={(e) => {
        if (onPointerDownOutside && e.target === e.currentTarget) {
          onPointerDownOutside(e);
        }
      }}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return <h2 className={`text-xl font-bold text-white ${className}`}>{children}</h2>;
}

export function DialogDescription({ children, className = "" }: DialogDescriptionProps) {
  return <p className={`text-sm text-slate-400 mt-2 ${className}`}>{children}</p>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>;
}