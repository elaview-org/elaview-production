import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "block w-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent",

        secondary:
          "rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      },

      size: {
        sm: "px-3 py-2",
        md: "px-4 py-2.5 text-base",
        lg: "px-4 py-3 text-lg",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
);
