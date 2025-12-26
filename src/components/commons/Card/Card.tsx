import type { ReactNode } from "react";
import { cn } from "@/utils/helpers";

export interface CardProps {
  children: ReactNode;
  field?: ReactNode;
  title?: string;
  primaryAction?: ReactNode;
  isComparable?: boolean;
  onDownload?: () => void;
  className?: string;
}

export default function Card({
  children,
  title,
  primaryAction,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-sm p-3",
        className ? className : ""
      )}
    >
      <div className="flex items-center text-neutral-black justify-between">
        {title && <h2 className="text-lg font-bold">{title}</h2>}
        {primaryAction}
      </div>
      {children}
    </div>
  );
}
