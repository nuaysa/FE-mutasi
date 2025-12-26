import { toastTypes } from "@/components/type";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

interface ToastProps {
  message?: string;
  type?: toastTypes;
  className?: string;
  onClose: () => void;
}

const toastVariants = cva(
  "flex items-center justify-between rounded-xl font-medium border-2 transition-colors cursor-pointer py-2 min-w-[300px] lg:w-[400px] my-1",
  {
    variants: {
      type: {
        INFO: "bg-primary-surface border-primary-main text-primary-main",
        SUCCESS:
          "bg-semantic-green3 border-semantic-green2 text-semantic-green2",
        ERROR: "bg-semantic-red2 border-semantic-red1 text-semantic-red1",
      },
    },
    defaultVariants: {
      type: "INFO",
    },
  }
);

export default function Toast({
  message,
  type,
  className,
  onClose,
}: ToastProps) {
 
  return (
    <div className={toastVariants({ type, className })}>
      <div className="flex justify-between w-full gap-2">
        <div className="flex items-center gap-3 px-4">
      
          <p className="text-sm font-semibold">{message}</p>
        </div>

        <button type="button" onClick={onClose} className="cursor-pointer">
          <X className="w-4 h-4 mx-2 font-bold text-neutral-black" />
        </button>
      </div>
    </div>
  );
}
