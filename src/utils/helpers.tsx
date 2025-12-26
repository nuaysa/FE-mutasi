import { statusMap } from "./constant";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const hasMultiplePages = (totalItems: number, pageSize: number): boolean => {
  if (!totalItems || !pageSize) return false;
  return Math.ceil(totalItems / pageSize) > 1;
};

interface formatDate {
  date: Date | string | null;
  isValue?: boolean;
}

export const formatDate = ({ date, isValue = false }: formatDate) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const res = isValue === false ? `${dd}-${mm}-${yyyy} ` : `${yyyy}-${mm}-${dd} `;
  return res;
};

export const getStatusColor = (status: string) => {
  const current = statusMap[status] ?? {
    label: "Unknown",
    variant: "SECONDARY",
  };

  switch (current.variant) {
    case "SUCCESS":
      return "font-bold text-semantic-green2";
    case "WARNING":
      return "font-bold text-semantic-yellow2 ";
    case "DANGER":
      return "font-bold text-semantic-red1 ";
    default:
      return "font-bold text-neutral-gray1";
  }
};

export const cn = (...inputs: string[]) => {
  return twMerge(clsx(inputs));
};

export const formatPrice = (value: string | number): string => {
  if (value === null || value === undefined) return "";

  const numeric = value.toString().replace(/\D/g, "");
  if (!numeric) return "";

  return new Intl.NumberFormat("id-ID").format(Number(numeric));
};

type TransactionType = "income" | "outcome" | "none";

export const formatPriceDisplay = ({ 
  amount, 
  type = "none" 
}: { 
  amount: number; 
  type?: TransactionType 
}) => {
  const formatted = new Intl.NumberFormat("id-ID").format(Math.abs(amount));

  let prefix = "";
  let className = "";

  if (type === "income") {
    prefix = "+ ";
    className = "text-semantic-green1 font-extrabold font-lg";
  } else if (type === "outcome") {
    prefix = "- ";
    className = "text-semantic-red1 font-extrabold font-lg";
  } else {
    prefix = amount < 0 ? "- " : "";
    className = "text-black font-extrabold font-lg";
  }

  return (
    <span className={className}>
      {prefix}Rp{formatted}
    </span>
  );
};

export const formatFilterDate = (dateString?: Date | string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export function mapToOptionsByKey<T>(
  data: T[] = [],
  key: keyof T
) {
  return data
    .map((item) => {
      const value = item[key];
      if (!value) return null;

      return {
        value: String(value),
        label: String(value),
      };
    })
    .filter(Boolean) as { value: string; label: string }[];
}

