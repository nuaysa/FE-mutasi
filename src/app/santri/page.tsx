"use client";

import Button from "@/components/commons/Button";
import FilterSection from "@/components/commons/FilterSection";
import Pagination from "@/components/commons/Pagination";
import { useAuthContext } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { hasMultiplePages } from "@/utils/helpers";
import { PlusCircle } from "lucide-react";

import { useSantriVM } from "./_viewModel/useSantriVm";
import SantriCards from "./_components/SantriCards";
import SantriCreateModal from "./_components/SantriModal";
import SantriDetailModal from "./_components/SantriDetailModal";

export default function Home() {
  const vm = useSantriVM();
  const { isAdmin } = useAuthContext();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="mx-2 md:px-0 flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Laporan Keuangan Santri</h1>

        {!isMobile && isAdmin && 
        <Button text="Tambah Santri" icon={<PlusCircle />} onClick={() => vm.setIsCreateModalOpen(true)} />
        }
      </div>

      {!isMobile && <FilterSection filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />}

      <div className={isMobile && isAdmin ? "pb-24" : ""}>
        <SantriCards vm={vm} />

        {vm.santris?.length !== 0 && hasMultiplePages(vm.totalItems, vm.pageSize) && (
          <Pagination totalItems={vm.totalItems} currentPage={vm.currentPage} perPage={vm.pageSize} onPageChange={vm.handlePageChange} onPerPageChange={vm.handlePageSizeChange} />
        )}
      </div>

      <SantriCreateModal isOpen={vm.isCreateModalOpen} onClose={() => vm.setIsCreateModalOpen(false)} vm={vm} />

      <SantriDetailModal
        santri={vm.currentSantri!}
        isOpen={vm.isDetailModalOpen}
        onClose={() => vm.setIsDetailModalOpen(false)}
        onEdit={() => {
          vm.setIsDetailModalOpen(false);
          vm.setMode("edit");
          vm.setIsCreateModalOpen(true);
        }}
      />

      {isMobile && isAdmin && (
        <div className="fixed bottom-0 w-full justify-evenly left-0 right-0 z-50 bg-white border-t border-primary-surface px-3 py-2 flex gap-2">
          <Button className="flex-[0.85]" text="Tambah Santri" icon={<PlusCircle />} onClick={() => vm.setIsCreateModalOpen(true)} />

          <FilterSection className="flex-[0.15]" filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />
        </div>
      )}
    </>
  );
}
