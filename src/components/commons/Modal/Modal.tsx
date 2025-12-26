import type React from "react";
import { useEffect, useRef } from "react";
import { CLOSE } from "@/components/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 bg-neutral-black/30 flex items-center justify-center z-30 p-4">
      <div
        ref={modalRef}
        className="relative bg-neutral-white rounded-lg w-auto mx-auto flex flex-col justify-center items-center text-center px-6 py-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-neutral-black cursor-pointer"
        >
          <CLOSE width={24} height={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
