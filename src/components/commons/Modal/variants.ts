import { cva } from "class-variance-authority";

const sharedMain = "border-t-4 border-primary-main";
const sharedMainIcon = "text-primary-main";

export const modalVariants = cva(
  "bg-neutral-white rounded-lg w-full max-w-lg mx-auto",
  {
    variants: {
      variant: {
        confirmation: sharedMain,
        warning: sharedMain,
        danger: "border-t-4 border-semantic-red1",
      },
    },
    defaultVariants: {
      variant: "confirmation",
    },
  }
);

export const modalIconVariants = cva("mb-4", {
  variants: {
    variant: {
      confirmation: sharedMainIcon,
      warning: sharedMainIcon,
      danger: "text-semantic-red1",
    },
  },
  defaultVariants: {
    variant: "confirmation",
  },
});
