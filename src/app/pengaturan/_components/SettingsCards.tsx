import CardList from "@/components/commons/CardList";
import { useSettingVM } from "../_viewModel/useSettingVm";
import { Store, Tag } from "lucide-react";
import { CardListItem } from "@/components/commons/CardList/CardList";

interface SettingsCardsProps {
  vm: ReturnType<typeof useSettingVM>;
}

export default function SettingsCards({ vm }: SettingsCardsProps) {
  if (vm.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardList title="Master Kategori" items={[]} isLoading={true} />
        <CardList title="Master Vendor" items={[]} isLoading={true} />
      </div>
    );
  }

  const categoryItems: CardListItem[] =
    vm.categories?.map((category) => ({
      id: category.id || category.name,
      title: category.name,
      icon: <Tag className="text-primary-main" size={18} />,
      onEdit: () => {
        vm.setMode("edit");
        vm.setType("category");
        vm.setIsCreateModalOpen(true);
      },
      onDelete: () => {vm.setType("category")
      vm.setIsModalOpen(true)}
    })) || [];

  const vendorItems: CardListItem[] =
    vm.vendors?.map((vendor) => ({
      id: vendor.id || vendor.name,
      title: vendor.name,
      icon: <Store className="text-primary-main" size={18} />,
      onEdit: () => {
        vm.setMode("edit");
        vm.setType("vendor");
        vm.setIsCreateModalOpen(true);
      },
      onDelete: () => {
        vm.setType("vendor")
        vm.setIsModalOpen(true)
      },
    })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardList
        title="Master Kategori"
        items={categoryItems}
        onAdd={() => {
          vm.setMode("create");
          vm.setType("category");
          vm.setIsCreateModalOpen(true);
        }}
        addButtonText="Tambah Kategori"
        emptyText="Belum ada kategori"
        className="h-fit"
      />

      <CardList
        title="Master Vendor"
        items={vendorItems}
        onAdd={() => {
          vm.setMode("create");
          vm.setType("vendor");
          vm.setIsCreateModalOpen(true);
        }}
        addButtonText="Tambah Vendor"
        emptyText="Belum ada vendor"
        className="h-fit"
      />
    </div>
  );
}

// Skeleton component untuk loading
function SantriCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-gray2 p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-neutral-gray3 rounded w-1/4"></div>
        <div className="h-9 bg-neutral-gray3 rounded w-32"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-neutral-gray3 rounded"></div>
        ))}
      </div>
    </div>
  );
}

// Empty state component
function EmptySantriState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-neutral-gray3 rounded-full flex items-center justify-center mb-4">
        <Tag className="text-neutral-gray2" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-gray1 mb-2">Belum ada data</h3>
      <p className="text-neutral-gray2">Mulai dengan menambahkan kategori atau vendor pertama</p>
    </div>
  );
}
