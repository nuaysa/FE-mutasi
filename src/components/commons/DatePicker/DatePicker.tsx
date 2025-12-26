"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Calendar, DateRange } from "react-date-range";
import { createPortal } from "react-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { cn, formatDate, formatFilterDate } from "@/utils/helpers";
import Button from "../Button";
import { ChevronDown, X } from "lucide-react";

interface CustomDatePickerProps {
  placeholder: string;
  className?: string;
  icon?: React.ReactElement;
  mode?: "single" | "range";
  value?: string;
  isFutureDisabled?: boolean;
  onChange?: (value: { start?: string | null; end?: string | null }) => void;
}

function useDateState(value: string | undefined) {
  const [savedStart, setSavedStart] = useState<Date | null>(null);
  const [savedEnd, setSavedEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (!value) {
      setSavedStart(null);
      setSavedEnd(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const start = parsed.start ? new Date(parsed.start) : null;
      const end = parsed.end ? new Date(parsed.end) : null;

      if (start && !Number.isNaN(start.getTime())) {
        setSavedStart(start);
      }

      if (end && !Number.isNaN(end.getTime())) setSavedEnd(end);
    } catch {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) setSavedStart(d);
    }
  }, [value]);

  const buildValue = (date: Date | null) => {
    if (!date) return null;

    const d = new Date(date);

    return d;
  };

  return {
    savedStart,
    savedEnd,
    setSavedStart,
    setSavedEnd,
    buildValue,
  };
}

function useDisplayValue(mode: "single" | "range", savedStart: Date | null, savedEnd: Date | null) {
  if (mode === "range" && savedStart && savedEnd) {
    return `${formatFilterDate(savedStart)} / ${formatFilterDate(savedEnd)}`;
  }
  return savedStart ? formatFilterDate(savedStart) : "";
}

export default function CustomDatePicker(props: CustomDatePickerProps) {
  const { placeholder, className, icon, mode = "single", onChange, value, isFutureDisabled = false } = props;

  const { savedStart, savedEnd, setSavedStart, setSavedEnd, buildValue } = useDateState(value);

  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTempStart(savedStart);
      setTempEnd(savedEnd);
    }
  }, [isOpen, savedStart, savedEnd]);

  useLayoutEffect(() => {
    if (!isOpen || !inputRef.current || typeof window === "undefined") return;

    const rect = inputRef.current.getBoundingClientRect();
    const modalWidth = 700;

    const top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (left + modalWidth > window.innerWidth + window.scrollX) {
      left = window.innerWidth + window.scrollX - modalWidth - 10;
    }
    if (left < window.scrollX) left = window.scrollX + 10;

    setPosition({ top, left });

    const handleOutside = (event: MouseEvent) => {
      if (modalRef.current?.contains(event.target as Node) || inputRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const handleCalendarSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setTempStart(startDate);
    setTempEnd(mode === "single" ? null : endDate);
  };

  const formatDateTime = (date: Date | null, isValue: boolean) => {
    if (!date) return "";
    return formatDate({ date, isValue });
  };

  const displayValue = useDisplayValue(mode, savedStart, savedEnd);

  const handleSave = () => {
    setIsOpen(false);
    setSavedStart(tempStart);
    setSavedEnd(tempEnd);

    if (!onChange) return;

    onChange({
      start: formatDateTime(buildValue(tempStart), true),
      end: mode === "range" ? formatDateTime(buildValue(tempEnd), true) : null,
    });
  };

  const selectionRange = {
    startDate: tempStart || new Date(),
    endDate: tempEnd || tempStart || new Date(),
    key: "selection",
  };

  const disabledApply = mode === "range" ? !tempStart || !tempEnd : !tempStart;

  return (
    <>
      <div className="relative">
        <input
          ref={inputRef}
          readOnly
          value={displayValue}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn("w-full border px-3 py-2 rounded-md cursor-pointer truncate overflow-x-hidden", className ? className : "")}
        />

        <div className="absolute inset-y-0 right-3 flex items-center text-neutral-black">
          {displayValue ? (
            <button
              type="button"
              onClick={() => {
                setSavedStart(null);
                setSavedEnd(null);
                onChange?.({ start: null, end: null });
              }}
              className="cursor-pointer"
            >
              <X size={15}/>
            </button>
          ) : (
            <div className="pointer-events-none">{icon || <ChevronDown  size={15}/>}</div>
          )}
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div ref={modalRef} style={{ position: "absolute", ...position, zIndex: 9999 }} className="bg-white rounded-lg p-6 w-max max-h-[80vh] shadow-lg border border-neutral-gray2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {mode === "range" ? (
                  <DateRange ranges={[selectionRange]} onChange={handleCalendarSelect} moveRangeOnFirstSelection={false} months={1} direction="horizontal" maxDate={isFutureDisabled ? new Date() : undefined} rangeColors={["#3b82f6"]} />
                ) : (
                  <Calendar date={tempStart || new Date()} onChange={(d: Date) => setTempStart(d)} maxDate={isFutureDisabled ? new Date() : undefined} />
                )}
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <div className="flex gap-2">
                <Button text="Batal" variant="PLAIN" size="SMALL" onClick={() => setIsOpen(false)} className="min-w-25" />
                <Button text="Simpan" variant="PRIMARY" size="SMALL" onClick={handleSave} disabled={disabledApply} className="min-w-25" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
