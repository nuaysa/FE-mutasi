import { cva } from "class-variance-authority";
import { statusMap } from "@/utils/constant";
import { cn } from "@/utils/helpers";

interface BadgeProps {
  text: string;
  variant?: "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCESS" | "WARNING";
  className?: string;
}

const badgeVariants = cva(
  "flex items-center justify-center rounded-full text-xs transition-colors px-2 py-0.5",
  {
    variants: {
      variant: {
        PRIMARY: "bg-primary-surface text-primary-main",
        SECONDARY:
          "bg-semantic-purple2 text-semantic-purple1",
        SUCCESS:
          "bg-semantic-green3 text-semantic-green2",
        WARNING:
          "bg-semantic-yellow3  text-semantic-yellow2",
        DANGER: "bg-semantic-red2 text-semantic-red1",
      },
    },
    defaultVariants: {
      variant: "PRIMARY",
    },
  }
);

export default function Badge({ text, variant, className }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className? className : "")}>
      <div className="flex w-max items-center gap-2 font-bold text-center">
        {text}
      </div>
    </div>
  );
}

export function renderStatus(status: string) {
  const current = statusMap[status] ?? {
    label: "UNKNOWN",
    variant: "SECONDARY",
  };

  return <Badge text={current.label} variant={current.variant} />;
}
