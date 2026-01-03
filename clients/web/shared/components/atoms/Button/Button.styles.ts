import { cva } from "class-variance-authority";

export const buttonStyles = cva("rounded-lg font-medium text-white", {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      ghost: "",
      grandient:
        "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25  shadow-lg transition-all duration-200 ",
    },
    size: {
      sm: "px-4 py-2",
      md: "px-6 py-2",
      lg: "",
    },
    color: {
      gray: "text-gray-300 hover:text-white transition-colors",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    color: "gray",
  },
});
