"use client";

import Papa from "papaparse";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/helpers";
import { Folders, X } from "lucide-react";

interface CSVUploadInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  error?: boolean;
  description?: string;
}

export const CSVUploadInput: React.FC<CSVUploadInputProps> = ({
  value = [],
  onChange,
  placeholder = "Input Customer IDs (ex: 7893,89374)",
  error = false,
  description,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fileError]);

  const tags = Array.isArray(value) ? value : [];

  const updateTags = (newTags: string[]) => {
    onChange?.(newTags);
  };

  const handleAddTag = (newTag: string) => {
    if (!newTag.trim() || Number.isNaN(Number(newTag))) return;
    if (!tags.includes(newTag)) updateTags([...tags, newTag]);
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Format harus dalam .csv");
      return;
    }

    setFileError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const parsed = Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
        });
        const ids = parsed.data
          .map((row : any) => row.id_customer)
          .filter((id) => id && !Number.isNaN(Number(id)))
          .map((id) => String(id).trim());

        updateTags([...new Set([...tags, ...ids])]);
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        fileInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    }
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="csv-tag-input"
        aria-label="CSV tag input area"
        className={cn(
          "flex flex-wrap items-center gap-2 border-2 rounded-md px-2 py-2 cursor-text min-h-[40px] w-full",
          error || fileError
            ? "border-semantic-red1"
            : "border-neutral-gray3 focus-within:border-primary-main"
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 border-2 text-sm bg-neutral-gray3 border-neutral-gray2 text-neutral-black px-2 py-1 rounded-md font-bold"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-neutral-black"
            >
              <X size={20} />
            </button>
          </span>
        ))}

        <input
          id="csv-tag-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 outline-none text-sm min-w-[80px]"
        />
      </label>
      <button
        type="button"
        aria-label="CSV file dropzone"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
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
            <span>Drag and drop files</span> or
            <span className="text-primary-main font-bold"> Browse</span>
          </p>
          <p className="text-xs text-neutral-gray1">
            Upload data dengan format .csv
          </p>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {(fileError || description) && (
        <p
          id="csv-description"
          className={cn(
            "text-xs italic transition-opacity duration-300",
            fileError ? "text-semantic-red1" : "text-neutral-gray1",
            fileError ? "opacity-100" : "opacity-70"
          )}
        >
          * {fileError || description}
        </p>
      )}
    </div>
  );
};
