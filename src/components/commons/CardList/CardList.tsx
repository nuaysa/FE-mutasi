"use client";

import { Plus } from "lucide-react";
import { cn } from "@/utils/helpers";

export interface CardListItem {
  id: string | number;
  title: string;
  description?: string;
  count?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface CardListProps {
  title: string;
  items: CardListItem[];
  onAdd?: () => void;
  addButtonText?: string;
  emptyText?: string;
  className?: string;
  itemClassName?: string;
  maxItems?: number;
  isLoading?: boolean;
  showCount?: boolean;
  showActions?: boolean;
}

export default function CardList({
  title,
  items,
  onAdd,
  addButtonText = "Tambah Kategori",
  emptyText = "Belum ada data",
  className = "",
  itemClassName = "",
  maxItems,
  isLoading = false,
  showCount = true,
  showActions = true,
}: CardListProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg border border-neutral-gray2 p-6", className)}>
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-neutral-gray3 rounded w-1/4 animate-pulse"></div>
          <div className="h-9 bg-neutral-gray3 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-neutral-gray3 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg border border-neutral-gray2 p-6", className)}>
     
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-black">{title}</h2>
          {items.length > 0 && showCount && (
            <p className="text-sm text-neutral-gray1 mt-1">
              {items.length} {items.length === 1 ? "kategori" : "kategori"}
            </p>
          )}
        </div>
        
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            {addButtonText}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-4 border border-neutral-gray2 rounded-lg hover:bg-neutral-gray4 transition-colors group",
                itemClassName
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.icon && (
                  <div className="shrink-0">{item.icon}</div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-black truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-neutral-gray1 truncate mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.count !== undefined && (
                  <span className="bg-neutral-gray3 text-neutral-black text-xs font-medium px-2 py-1 rounded">
                    {item.count} item
                  </span>
                )}
                
                {showActions && (item.onEdit || item.onDelete) && (
                  <div className="flex items-center gap-2 opacity-100 transition-opacity">
                    {item.onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onEdit?.();
                        }}
                        className="text-primary-main hover:text-primary-dark text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {item.onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onDelete?.();
                        }}
                        className="text-semantic-red1 hover:text-semantic-red2 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-neutral-gray2 rounded-lg">
            <p className="text-neutral-gray1">{emptyText}</p>
            {onAdd && (
              <button
                onClick={onAdd}
                className="mt-4 text-primary-main hover:text-primary-dark text-sm font-medium"
              >
                + {addButtonText}
              </button>
            )}
          </div>
        )}

        {maxItems && items.length > maxItems && (
          <div className="text-center pt-4 border-t border-neutral-gray2">
            <p className="text-sm text-neutral-gray1">
              Dan {items.length - maxItems} lainnya...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}