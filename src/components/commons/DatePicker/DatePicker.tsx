"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Calendar, DateRange } from "react-date-range";
import { createPortal } from "react-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { cn, formatDate, formatFilterDate } from "@/utils/helpers";
import Button from "../Button";
import { ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

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
const modalHeight = mode === "range" ? 420 : 340;

const scrollY = window.scrollY;
const scrollX = window.scrollX;
const viewportHeight = window.innerHeight;

const spaceBelow = viewportHeight - rect.bottom;
const spaceAbove = rect.top;

let top: number;

if (spaceBelow < modalHeight && spaceAbove > modalHeight) {
  top = rect.top + scrollY - modalHeight - 4;
} else {
  top = rect.bottom + scrollY + 4;
}

let left = rect.left + scrollX;

if (left + modalWidth > window.innerWidth + scrollX) {
  left = window.innerWidth + scrollX - modalWidth - 10;
}
if (left < scrollX) left = scrollX + 10;

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
  const isMobile = useIsMobile();

  function renderMobilePicker() {
  return (
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-end">
      <div
        ref={modalRef}
        className="bg-white w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-end text-black items-center">
          <button onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {mode === "range" ? (
          <DateRange
            ranges={[selectionRange]}
            onChange={handleCalendarSelect}
            months={1}
            direction="vertical"
            moveRangeOnFirstSelection={false}
            maxDate={isFutureDisabled ? new Date() : undefined}
            rangeColors={["#3b82f6"]}
          />
        ) : (
          <Calendar
            date={tempStart || new Date()}
            onChange={(d: Date) => setTempStart(d)}
            maxDate={isFutureDisabled ? new Date() : undefined}
          />
        )}

        <div className="flex gap-2 mt-4">
          <Button
            text="Batal"
            variant="PLAIN"
            size="SMALL"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          />
          <Button
            text="Simpan"
            variant="PRIMARY"
            size="SMALL"
            onClick={handleSave}
            disabled={disabledApply}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

function renderDesktopPicker() {
  return (
    <div
      ref={modalRef}
      style={{ position: "absolute", ...position, zIndex: 9999 }}
      className="bg-white rounded-lg p-4 w-max shadow-lg border border-neutral-gray2"
    >

        {mode === "range" ? (
          <DateRange
            ranges={[selectionRange]}
            onChange={handleCalendarSelect}
            months={1}
            direction="vertical"
            moveRangeOnFirstSelection={false}
            maxDate={isFutureDisabled ? new Date() : undefined}
            rangeColors={["#3b82f6"]}
          />
        ) : (
          <Calendar
            date={tempStart || new Date()}
            onChange={(d: Date) => setTempStart(d)}
            maxDate={isFutureDisabled ? new Date() : undefined}
          />
        )}

        <div className="flex gap-2 mt-4">
          <Button
            text="Batal"
            variant="PLAIN"
            size="SMALL"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          />
          <Button
            text="Simpan"
            variant="PRIMARY"
            size="SMALL"
            onClick={handleSave}
            disabled={disabledApply}
            className="flex-1"
          />
        </div>
    </div>
  );
}

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
              <X size={15} />
            </button>
          ) : (
            <div className="pointer-events-none">{icon || <ChevronDown size={15} />}</div>
          )}
        </div>
      </div>

  {isOpen &&
  createPortal(
    isMobile ? renderMobilePicker() : renderDesktopPicker(),
    document.body
  )}
    </>
  );
}

