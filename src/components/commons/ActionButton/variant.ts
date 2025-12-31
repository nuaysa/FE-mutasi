import { cva } from "class-variance-authority";

export const actionButtonVariants = cva(
  "font-bold p-1 rounded-xl cursor-pointer border-2",
  {
    variants: {
      intent: {
        view: "text-neutral-gray1",
        edit: "text-primary-main",
        delete: "text-semantic-red1",
      },
      variant: {
        PRIMARY: "hover:bg-neutral-gray2 border-neutral-gray2",
        SECONDARY: "",
      },
    },
    compoundVariants: [
      {
        intent: "edit",
        variant: "SECONDARY",
        class: "border-primary-main",
      },
      {
        intent: "delete",
        variant: "SECONDARY",
        class: "border-semantic-red1",
      },
      {
        intent: "view",
        variant: "SECONDARY",
        class: "border-neutral-gray2",
      },
    ],
    defaultVariants: {
      variant: "PRIMARY",
    },
  }
);
