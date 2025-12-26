"use client";

import { cn } from "@/utils/helpers";
import Button from "../Button";
import DateRangePicker from "../DatePicker";
import SelectField from "../Form/SingleSelect";
import { ChevronDown, FilterIcon, Search, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

export interface FilterField {
  label: string;
  key: string;
  type: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  placeholder?: string;
  dateType?: "single" | "range";
  loadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

interface FilterSectionProps {
  filters: FilterField[];
  values: Record<string, string | string[]>;
  onFilterChange: (key: string, value: string | string[]) => void;
  onReset?: () => void;
  className?: string;
}

function FilterFieldRenderer({ filter, value, label, onChange, className = "" }: { label: string; filter: FilterField; value: string | string[]; onChange: (val: string | string[]) => void; className?: string }) {
  const hasValue = Array.isArray(value) ? value.length > 0 : (value ?? "") !== "";

  if (filter.type === "select") {
    const v = typeof value === "string" ? value : "";
    return (
      <div className="relative flex-col gap-3 flex-1 w-full">
        <p className="font-bold text-neutral-gray1">{label}</p>
        <div className="relative flex-1 w-full">
          <SelectField options={filter.options ?? []} value={v} onChange={(val) => onChange(val)} placeholder={filter.placeholder} icon={false} onLoadMore={filter.loadMore} hasMore={filter.hasMore} className="h-8" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {hasValue ? (
              <button type="button" onClick={() => onChange("")} className="text-neutral-black hover:text-neutral-black cursor-pointer">
                <XCircle size={15} />
              </button>
            ) : (
              <ChevronDown size={15} className="text-neutral-black pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (filter.type === "date") {
    const v = typeof value === "string" ? value : "";
    return (
      <div className="flex flex-col flex-1 w-full">
        <p className="font-bold text-neutral-gray1">{label}</p>
        <DateRangePicker
          isFutureDisabled={false}
          mode={filter.dateType}
          placeholder={filter.placeholder || "Periode ( start - end date )"}
          className={cn(
            "w-full border border-neutral-gray2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-main placeholder-neutral-gray1 pr-10 truncate overflow-hidden h-8",
            value ? "text-neutral-black" : "text-neutral-gray1",
            className
          )}
          value={v}
          onChange={(dateValue) => {
            if (filter.dateType === "single" && dateValue.start) {
              onChange(dateValue.start.toString());
            } else if (filter.dateType === "range" && dateValue.start && dateValue.end) {
              onChange(`${dateValue.start.toString()}|${dateValue.end.toString()}`);
            } else {
              onChange("");
            }
          }}
        />
      </div>
    );
  }

  const inputValue = typeof value === "string" ? value : "";

  return (
    <div className="relative flex flex-col gap-2 flex-1">
      <p className="font-bold text-neutral-gray1">{label}</p>

      <div className="relative">
        <div className="absolute inset-y-0 left-2 flex items-center text-neutral-gray1 pointer-events-none">
          <Search size={15} />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
          className={cn(
            "w-full h-8 pl-8 pr-3 border border-neutral-gray2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-main placeholder-neutral-gray1",
            value ? "text-neutral-black" : "text-neutral-gray1",
            className
          )}
        />
      </div>
    </div>
  );
}

export default function FilterSection({ filters, values, onFilterChange, onReset, className = "" }: FilterSectionProps) {
  if (filters.length === 0) return null;
  const hasActiveFilter = Object.values(values).some((v) => (Array.isArray(v) ? v.length > 0 : (v ?? "") !== ""));

  const isMobile = useIsMobile();
  const [openSheet, setOpenSheet] = useState(false);

  const getValueFor = (key: string) => {
    const v = values[key];

    return v;
  };

  if (isMobile) {
    return (
      <>
        <div className="flex justify-end">
          <Button variant="PLAIN" size="SMALL" onClick={() => setOpenSheet(true)} className={cn("font-extrabold rounded-xl", hasActiveFilter ? "border-primary-main text-primary-main" : "")} icon={<FilterIcon size={20} />} />
        </div>

        {openSheet && (
          <div className="fixed inset-0 z-50 flex items-end">
            <button className="absolute inset-0 bg-neutral-black/40" onClick={() => setOpenSheet(false)} />

            <div className="relative w-full bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
              <div className="flex justify-center py-2">
                <span className="h-1 w-12 rounded-full bg-neutral-gray2" />
              </div>

              <div className="flex justify-between items-center px-4 py-3 border-b text-black border-neutral-gray2">
                <p className="font-bold text-lg">Filter</p>
                <button onClick={() => setOpenSheet(false)}>
                  <XCircle size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                {filters.map((filter) => (
                  <FilterFieldRenderer key={filter.key} label={filter.label} filter={filter} value={getValueFor(filter.key)} onChange={(val) => onFilterChange(filter.key, val)} />
                ))}
              </div>

              <div className="border-t border-neutral-gray2 px-4 py-3 flex gap-3">
                {hasActiveFilter && <Button text="Reset" variant="OUTLINE" size="SMALL" onClick={onReset} className="flex-1 font-bold" />}
                <Button text="Terapkan" variant="PRIMARY" size="SMALL" onClick={() => setOpenSheet(false)} className="flex-1 font-bold" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className={`bg-white rounded-xl border border-neutral-gray2 px-4 py-2 w-full ${className}`}>
        <div className="flex lg:flex-row flex-col gap-4 w-full items-center">
          {filters && (
            <div className="flex flex-wrap gap-4 w-full">
              {filters.map((filter) => (
                <div key={filter.key} className="min-w-37.5">
                  <FilterFieldRenderer label={filter.label} filter={filter} value={getValueFor(filter.key)} onChange={(val) => onFilterChange(filter.key, val)} />
                </div>
              ))}
            </div>
          )}
          <Button text="Reset filter" variant="OUTLINE" size="LARGE" onClick={onReset} className={cn("whitespace-nowrap font-extrabold ml-auto bg-primary-hover p-2 rounded-xl", hasActiveFilter ? "block" : "hidden")} />
        </div>
      </div>
    );
  }
}
