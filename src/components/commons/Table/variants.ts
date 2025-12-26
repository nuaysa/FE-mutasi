import { cva } from "class-variance-authority";

export const cellVariants = cva(
  "py-3 text-xs text-neutral-black border-b border-neutral-gray2 whitespace-nowrap",
  {
    variants: {
      isFirst: {
        true: "w-[60px] px-4",
        false: "px-3",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      fixed: {
        true: "sticky bg-neutral-white",
        false: "",
      },
    },
    defaultVariants: {
      align: "left",
      fixed: false,
      isFirst: false,
    },
  }
);

export const headerVariants = cva(
  "py-3 text-xs font-semibold text-neutral-gray1 border-b border-neutral-gray2 whitespace-normal break-words",
  {
    variants: {
      isFirst: {
        true: "w-[60px] px-4",
        false: "px-3",
      },
      fixed: {
        true: "sticky bg-white z-10",
        false: "",
      },
    },
    defaultVariants: {
      fixed: false,
      isFirst: false,
    },
  }
);
