"use client";

import CardList from "@/components/commons/CardList";
import { useSettingVM } from "../_viewModel/useSettingVm";
import { Store, Tag } from "lucide-react";
import { CardListItem } from "@/components/commons/CardList/CardList";

interface SettingsCardsProps {
  vm: ReturnType<typeof useSettingVM>;
}

export default function SettingsCards({ vm }: SettingsCardsProps) {
  if (vm.isLoadingData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-neutral-gray2 p-6 animate-pulse">
          <div className="h-6 bg-neutral-gray3 rounded w-1/3 mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-gray3 rounded mb-3"></div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-neutral-gray2 p-6 animate-pulse">
          <div className="h-6 bg-neutral-gray3 rounded w-1/3 mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-gray3 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  const categoryItems: CardListItem[] = vm.categories.map((category) => ({
    id: category.id!,
    title: category.name,
    icon: <Tag className="text-primary-main" size={18} />,
    onEdit: () => vm.handleOpenEditModal(category, "category"),
    onDelete: () => {
      vm.setSelectedItem(category);
      vm.setType("category");
      vm.setIsModalOpen(true);
    },
  }));

  const vendorItems: CardListItem[] = vm.vendors.map((vendor) => ({
    id: vendor.id!,
    title: vendor.name,
    icon: <Store className="text-primary-main" size={18} />,
    onEdit: () => vm.handleOpenEditModal(vendor, "vendor"),
    onDelete: () => {
      vm.setSelectedItem(vendor);
      vm.setType("vendor");
      vm.setIsModalOpen(true);
    },
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-90 lg:h-105">
        <CardList
          title="Master Kategori"
          items={categoryItems}
          onAdd={() => vm.handleOpenCreateModal("category")}
          addButtonText="Tambah Kategori"
          emptyText="Belum ada kategori"
          className="flex-1 overflow-y-auto h-full flex flex-col  scrollbar-thin scrollbar-thumb-neutral-gray3"
          isLoading={vm.isLoading}
        />
      </div>

      <div className="h-90 lg:h-105">
        <CardList
          title="Master Vendor"
          items={vendorItems}
          onAdd={() => vm.handleOpenCreateModal("vendor")}
          addButtonText="Tambah Vendor"
          emptyText="Belum ada vendor"
          className="flex-1 overflow-y-auto h-full flex flex-col  scrollbar-thin scrollbar-thumb-neutral-gray3"
          isLoading={vm.isLoading}
        />
      </div>
    </div>
  );
}
