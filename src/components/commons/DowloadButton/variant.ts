import { cva } from "class-variance-authority";

export const actionButtonVariants = cva(
  "font-bold p-1 rounded-lg cursor-pointer border-2",
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
        class: "bg-primary-surface border-primary-main",
      },
      {
        intent: "delete",
        variant: "SECONDARY",
        class: "bg-semantic-red2 border-semantic-red1",
      },
      {
        intent: "view",
        variant: "SECONDARY",
        class: "hover:bg-neutral-gray2 border-neutral-gray2",
      },
    ],
    defaultVariants: {
      variant: "PRIMARY",
    },
  }
);
