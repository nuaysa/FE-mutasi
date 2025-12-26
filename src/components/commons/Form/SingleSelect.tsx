"use client";

import { useState } from "react";
import { Command, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: boolean;
  error?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  searchPlaceholder?: string;
};

export default function SelectField({
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Pilih data",
  className,
  disabled = false,
  icon: iconProp,
  error,
  onLoadMore,
  hasMore = false,
  searchPlaceholder = "Cari...",
}: SelectFieldProps) {
  const icon = iconProp ?? true;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || !onLoadMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) onLoadMore();
  };

  return (
    <div className={cn("relative inline-block w-full", className ? className : "")}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full inline-flex items-center justify-between border bg-neutral-white border-neutral-gray2 rounded-lg text-sm focus:ring-2 text-neutral-gray1 focus:ring-primary-main appearance-none overflow-hidden truncate transition-all pr-8 pl-3 h-10",
              className ? className : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              error ? "border-semantic-red1 focus:ring-semantic-red1" : "",
              value ? "text-neutral-black" : ""
            )}
          >
            <span className="overflow-hidden whitespace-nowrap text-ellipsis block">{options.find((opt) => opt.value === value)?.label || placeholder}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 bg-white text-black" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />

            <CommandList onScroll={handleScroll} className="max-h-52 overflow-auto">
              <CommandEmpty>Tidak ada data</CommandEmpty>

              {options.map((o, index) => (
                <CommandItem key={`${o.value}-${index}`} value={o.label} onSelect={() => handleChange(o.value)} className="cursor-pointer px-3 py-2">
                  {o.label}
                </CommandItem>
              ))}

              {hasMore && (
                <div className="flex justify-center py-2 text-xs text-neutral-gray2">
                  <ChevronDown className=" text-black animate-bounce" />
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {icon && <ChevronDown className=" text-black absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />}
    </div>
  );
}
