"use client";

import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/utils/helpers";
import ActionButton from "../ActionButton";
import Button from "../Button";
import { cellVariants, headerVariants } from "./variants";
import { ArrowUpDown } from "lucide-react";

export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc" | null;
}

export interface Column<T> {
  header: string;
  accessor: keyof T | string | ((row: T) => React.ReactNode);
  className?: string;
  render?: (row: T) => React.ReactNode;
  fixedRight?: boolean;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: number;
  required?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onReset?: () => void;
  className?: string;
  emptyMessage?: React.ReactNode;
  isLoading?: boolean;
  isFiltering?: boolean;
  onSort?: (sortConfig: SortConfig | null) => void;
  rowId?: keyof T;
  sortConfig?: SortConfig;
  expandableRender?: (row: T) => React.ReactNode;
  showActionColumn?: boolean;
  actionColumnHeader?: string;
}

function TableLoading({ colSpan }: { colSpan: number }) {
  const rowKeys = useMemo(() => Array.from({ length: 10 }, () => crypto.randomUUID()), []);
  const colKeys = useMemo(() => Array.from({ length: colSpan }, () => crypto.randomUUID()), [colSpan]);
  return (
    <>
      {rowKeys.map((rowKey) => (
        <tr key={rowKey} className="animate-pulse">
          {colKeys.map((colKey) => (
            <td key={colKey} className="px-3 py-4">
              <div className="h-4 w-full rounded bg-neutral-gray2/50"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function TableEmpty({ title, onReset, emptyMessage, isFiltering = false }: { title?: string; onReset?: () => void; emptyMessage?: React.ReactNode; isFiltering: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full my-15">
      <Image src="/not-found.png" alt="tidak ditemukan" width={60} height={90} />

      {emptyMessage ? emptyMessage : <p className="text-neutral-black font-bold text-lg">{`${title ?? "Data"} tidak ditemukan`}</p>}

      {onReset && isFiltering && (
        <>
          <p className="text-neutral-black mb-2">Coba cek kembali filter yang aktif atau reset filter dulu, ya</p>
          <Button text="Reset filter" size="SMALL" className="max-w-75 px-14" onClick={onReset} />
        </>
      )}
    </div>
  );
}

export default function Table<T>({
  columns,
  data,
  className,
  onSort,
  isLoading,
  title,
  rowId = "id" as keyof T,
  sortConfig,
  onReset,
  expandableRender,
  emptyMessage,
  isFiltering = false,
  showActionColumn = true,
  actionColumnHeader = "Action",
}: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  const toggleExpand = useCallback((id: string | number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const allColumns = useMemo(() => {
    const baseColumns = [...columns];
    if (showActionColumn && expandableRender) {
      const filteredColumns = baseColumns.filter((col) => !(col.fixedRight && col.header.toUpperCase() === actionColumnHeader));
      return [...filteredColumns];
    }
    return baseColumns;
  }, [columns, showActionColumn, expandableRender, actionColumnHeader]);

  const regularColumns = allColumns.filter((col) => !col.fixedRight);
  const fixedColumns = allColumns.filter((col) => col.fixedRight);
  const totalColumns = regularColumns.length + fixedColumns.length;

  const getValue = (row: T, accessor: Column<T>["accessor"]) => (typeof accessor === "function" ? accessor(row) : (row[accessor as keyof T] as React.ReactNode));

  const getFixedOffset = (index: number) => {
    let offset = 0;
    for (let i = index + 1; i < fixedColumns.length; i++) {
      offset += fixedColumns[i].width || 70;
    }
    return offset;
  };

  const getSortKey = (col: Column<T>): string | null => {
    const { accessor } = col;
    if (typeof accessor === "function") return null;
    return String(accessor);
  };

  const handleSort = (col: Column<T>) => {
    const key = getSortKey(col);
    if (!key) return;

    let direction: "asc" | "desc" = "asc";

    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    onSort?.({ key, direction });
  };

  const renderCell = (row: T, col: Column<T>, colIdx: number, fixed?: boolean) => {
    const key = `${String(row[rowId])}-${fixed ? "fixed" : "reg"}-${String(col.accessor)}`;

    return (
      <td
        key={key}
        className={cellVariants({
          isFirst: colIdx === 0,
          align: col.align,
          fixed,
        })}
        style={
          fixed
            ? {
                minWidth: col.width || 60,
                maxWidth: col.width || 150,
                right: getFixedOffset(colIdx),
              }
            : undefined
        }
      >
        <div
          className={cn(
            "h-full flex items-center relative pr-4",
            col.align
              ? {
                  left: "justify-start",
                  center: "justify-center",
                  right: "justify-end",
                }[col.align]
              : ""
          )}
        >
          {col.render ? col.render(row) : getValue(row, col.accessor)}
        </div>
      </td>
    );
  };

  const safeData = data || [];
  return (
    <div className={`w-full ${className}`}>
      {(isLoading || safeData.length > 0) && (
        <div className={cn("overflow-x-auto w-full rounded-lg border border-neutral-gray2 shadow-sm")}>
          <table className="table-auto w-full bg-white border-collapse">
            <thead className="bg-neutral-gray2 sticky top-0 z-20">
              <tr>
                {regularColumns.map((col, idx) => (
                  <th
                    key={String(col.accessor)}
                    className={cn(
                      "bg-neutral-gray4",
                      headerVariants({
                        isFirst: idx === 0,
                        fixed: false,
                      }),
                      col.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                    )}
                    style={col.width ? { width: col.width, minWidth: col.width } : {}}
                    onClick={() => col.sortable && handleSort(col)}
                  >
                    <div className={cn("h-full flex items-center relative pr-4", col.align === "center" ? "justify-center" : "", col.align === "right" ? "justify-end" : "", !col.align ? "justify-between" : "")}>
                      <p className="text-neutral-gray1 font-bold">
                        {" "}
                        {col.header.toUpperCase()} {col.required && <span className="text-semantic-red1">*</span>}
                      </p>
                      {col.sortable && (
                        <span className={cn("cursor-pointer", col.align === "center" || "right" ? "ml-1" : "")}>
                          <ArrowUpDown className="text-neutral-gray1 opacity-50" />
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {fixedColumns.map((col, idx) => (
                  <th
                    key={`fixed-${col.header.toUpperCase()}`}
                    className={cn(
                      headerVariants({
                        isFirst: idx === 0,
                        fixed: true,
                      }),
                      "bg-neutral-gray4"
                    )}
                    style={{
                      right: getFixedOffset(idx),
                      minWidth: col.width || 60,
                      maxWidth: col.width || 150,
                    }}
                  >
                    <div className="h-full w-full flex items-center justify-center relative pr-4">
                      <p className="text-neutral-gray1 font-bold">{col.header.toUpperCase()}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              {isLoading ? (
                <TableLoading colSpan={totalColumns} />
              ) : (
                safeData.map((row) => {
                  const id = row[rowId] as string | number;
                  const isExpanded = expandedRows.has(id);

                  return (
                    <React.Fragment key={id}>
                      <tr className={cn("hover:bg-gray-50 border-b border-neutral-gray2 last:border-b-0", expandableRender ? "cursor-pointer" : "")}>
                        {regularColumns.map((col, idx) => renderCell(row, col, idx))}
                        {fixedColumns.map((col, idx) => renderCell(row, col, idx, true))}
                      </tr>

                      {isExpanded && expandableRender && (
                        <tr className={cn("bg-neutral-gray3/10 border-b border-neutral-gray2")}>
                          <td colSpan={totalColumns + 1} className="p-4">
                            {expandableRender(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && safeData.length === 0 && <TableEmpty isFiltering={isFiltering} title={title} onReset={onReset} emptyMessage={emptyMessage} />}
    </div>
  );
}
