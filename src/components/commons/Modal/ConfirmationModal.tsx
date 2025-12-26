import type React from "react";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { modalIconVariants } from "./variants";
import { CircleQuestionMark, MessageCircleWarning, Trash, X } from "lucide-react";

export type ModalVariant = "confirmation" | "danger" | "warning";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  children?: React.ReactNode;
  confirmationText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  variant = "confirmation",
  title,
  description,
  confirmText = "Yes, Save",
  cancelText = "Cancel",
  onConfirm,
  children,
  confirmationText,
}: ModalProps) {
  const [confirmationInput, setConfirmationInput] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    confirmation: {
      buttonVariant: "PRIMARY" as const,
      icon: (
        <CircleQuestionMark
          size={70}
          className={modalIconVariants({ variant })}
        />
      ),
    },
    danger: {
      buttonVariant: "DANGER" as const,
      icon: (
        <Trash  size={70}
          className={modalIconVariants({ variant })}
        />
      ),
    },
    warning: {
      buttonVariant: "PRIMARY" as const,
      icon: (
        <MessageCircleWarning
          size={70}
          className={modalIconVariants({ variant })}
        />
      ),
    },
  };

  const currentVariant = variantStyles[variant];

  const isConfirmationValid =
    variant === "danger" && confirmationText
      ? confirmationInput === confirmationText
      : true;

  const handleConfirm = () => {
    if (variant === "danger" && confirmationText && !isConfirmationValid) {
      return;
    }
    onConfirm();
    setConfirmationInput("");
  };

  return (
    <div className="fixed inset-0 bg-neutral-black/30 flex items-center justify-center z-30 p-4">
      <div
        ref={modalRef}
        className="relative bg-neutral-white rounded-lg w-120 mx-auto flex flex-col justify-center items-center text-center px-6 py-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-neutral-black cursor-pointer"
        >
          <X   size={20} />
        </button>
        <span className="flex justify-center w-full">
          {currentVariant.icon}
        </span>
        <h2 className="text-xl font-bold text-neutral-black mb-3">{title}</h2>
        <p className="text-neutral-black mb-6 text-sm">{description}</p>

        {variant === "danger" && confirmationText && (
          <div className="w-full mb-6">
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={`Ketik "${confirmationText}" untuk mengonfirmasi`}
              className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-1 
                 border-semantic-red1 focus:ring-semantic-red1 text-neutral-black`}
            />
            {confirmationInput && !isConfirmationValid && (
              <p className="text-xs text-semantic-red1 mt-2 text-left">
                Text tidak sesuai
              </p>
            )}
          </div>
        )}

        {children && <div className="mb-6">{children}</div>}

        <div className="flex w-full gap-5 justify-between">
          <Button
            text={cancelText}
            variant="PLAIN"
            onClick={onClose}
            size="LARGE"
            className="w-full"
          />
          <Button
            text={confirmText}
            variant={currentVariant.buttonVariant}
            onClick={handleConfirm}
            size="LARGE"
            className="w-full"
            disabled={
          variant === "danger" && confirmationText 
      ? !isConfirmationValid 
      : false }
          />
        </div>
      </div>
    </div>
  );
}
