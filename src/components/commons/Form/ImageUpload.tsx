"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/helpers";
import { Folders, X } from "lucide-react";

interface ImageUploadProps {
  value?: string | File;
  onChange?: (value: string | File) => void;
  error?: boolean;
  description?: string;
  isButtonStyle?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = "",
  onChange,
  error = false,
  description,
  isButtonStyle = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview("");
      return;
    }

    if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
      return;
    }

    setPreview(value);
  }, [value]);

  const updateImage = (newImage: string | File | null) => {
    onChange?.(newImage ?? "");
    if (newImage instanceof File) {
      setPreview(URL.createObjectURL(newImage));
    } else {
      setPreview(newImage ?? "");
    }
    setImageError(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(png|jpg|jpeg|webp)$/i.test(file.name)) {
      setFileError("Format tidak didukung");
      return;
    }

    setFileError(null);
    setPreview(URL.createObjectURL(file));
    onChange?.(file);
  };

  const handleRemove = () => {
    updateImage(null);
    setImageError(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const changeEvent = new Event("change", { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleRetryUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {isButtonStyle ? (
        preview && !imageError ? (
          <div className="relative w-32.5 h-15">
            <Image
              src={preview}
              alt="uploaded-banner"
              fill
              unoptimized
              onError={handleImageError}
              className="object-contain w-full h-full rounded-md border border-neutral-gray3 bg-neutral-gray4"
            />
            <div className="absolute inset-0 flex justify-end items-start p-1 gap-1 bg-black/30 rounded-md opacity-0 hover:opacity-100 transition">
              <button
                type="button"
                onClick={handleRetryUpload}
                className="bg-white/90 text-neutral-black text-xs font-medium px-2 py-1 rounded-md hover:bg-white transition"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-semantic-red1/90 text-white text-xs font-medium px-2 py-1 rounded-md hover:bg-semantic-red1 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            aria-label="upload banner"
            onClick={handleRetryUpload}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleRetryUpload();
              }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "rounded-md px-3 py-2 my-0 text-center text-white font-bold text-sm cursor-pointer transition w-full bg-primary-main hover:bg-primary-dark",
              error || fileError ? "ring-2 ring-semantic-red1" : ""
            )}
          >
            Upload banner
          </button>
        )
      ) : (
        <>
          {preview && !imageError ? (
            <div className="relative w-full h-37.5">
              <Image
                src={preview}
                alt="uploaded-preview"
                fill
                unoptimized
                onError={handleImageError}
                className="object-contain w-full h-full rounded-md border border-neutral-gray3 bg-neutral-gray4"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-neutral-black/70 p-1 rounded-full hover:opacity-100 opacity-80 transition"
              >
                <X className="text-white w-3 h-3" />
              </button>
            </div>
          ) : (
            preview &&
            imageError && (
              <div className="relative w-full h-22.5 border border-neutral-gray3 rounded-md flex flex-col items-center justify-center gap-2 bg-neutral-gray4">
                <p className="text-xs text-semantic-red1">
                  Gagal memuat gambar
                </p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs bg-semantic-red1 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            )
          )}

          {!preview && (
            <button
              type="button"
              aria-label="image file dropzone"
              onClick={handleRetryUpload}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRetryUpload();
                }
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors w-full",
                error || fileError
                  ? "border-semantic-red1"
                  : "hover:border-primary-main"
              )}
            >
              <div className="flex flex-col justify-center items-center gap-3 text-neutral-black">
                <Folders aria-hidden="true" />
                <p className="text-sm font-medium">
                  <span>Drag and drop image</span> or
                  <span className="text-primary-main font-bold"> Browse</span>
                </p>
                <p className="text-xs text-neutral-gray1">
                  Upload gambar (.png, .jpg, .jpeg, .webp)
                </p>
              </div>
            </button>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {(fileError || description) && (
        <p
          id="image-description"
          className={cn(
            "text-xs italic",
            fileError ? "text-semantic-red1" : "text-neutral-gray1"
          )}
        >
          * {fileError || description}
        </p>
      )}
      {!isButtonStyle && (
        <p className="text-xs text-neutral-gray1 italic mt-1">
          * Ukuran gambar: 335 x 90 px
        </p>
      )}
    </div>
  );
};
