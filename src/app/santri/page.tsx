"use client";

import Button from "@/components/commons/Button";
import FilterSection from "@/components/commons/FilterSection";
import { useAuthContext } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { hasMultiplePages } from "@/utils/helpers";
import Pagination from "@/components/commons/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSantriVM } from "./_viewModel/useSantriVm";
import SantriCreateModal from "./_components/SantriModal";
import SantriCards from "./_components/SantriCards";
import SantriDetailModal from "./_components/SantriDetailModal";
import { dummySantri } from "@/components/dummy/Santri";

// export default withAuth(EventPage, {
//   role: [ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.USER],
// });

export default function home() {
  const vm = useSantriVM();

  const { isAdmin, isSuperAdmin, isAuthenticated } = useAuthContext();
  const isMobile = useIsMobile();
  return (
    <>
      <div className="mx-2 md:px-0 flex flex-col lg:flex-row gap-3 lg:gap-0 justify-center items-center lg:justify-between mb-6">
        <h1 className="text-2xl text-neutral-black font-bold">Laporan Keuangan Santri</h1>
        <div className={`${isMobile ? "hidden" : "flex"} gap-3`}>
          <Button
            text="Tambah Santri"
            icon={<PlusCircle />}
            onClick={() => {
              vm.setIsCreateModalOpen(true);
            }}
          />
        </div>
      </div>

      <div className={`${isMobile ? "hidden" : "flex"}`}>
        <FilterSection filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />
      </div>

      <SantriCards vm={vm} />
      {vm.santris && vm.santris.length !== 0 && hasMultiplePages(vm.totalItems, vm.pageSize) && (
        <Pagination totalItems={vm.totalItems} currentPage={vm.currentPage} perPage={vm.pageSize} onPageChange={vm.handlePageChange} onPerPageChange={vm.handlePageSizeChange} />
      )}

      <SantriCreateModal isOpen={vm.isCreateModalOpen} onClose={() => vm.setIsCreateModalOpen(false)} vm={vm} />
      <SantriDetailModal
        onEdit={() => {
          vm.setIsDetailModalOpen(false);
          vm.setMode("edit");
          vm.setIsCreateModalOpen(true);
        }}
        isOpen={vm.isDetailModalOpen}
        onClose={() => vm.setIsDetailModalOpen(false)}
        santri={dummySantri[0]}
      />

      <div className={`${isMobile ? "flex" : "hidden"} justify-between items-center border-t px-3 border-primary-surface bg-white sticky bottom-0 py-2 w-full gap-2 z-20`}>
        <Button
          className="w-1/2"
          text="Tambah Santri"
          icon={<PlusCircle />}
          onClick={() => {
            vm.setIsCreateModalOpen(true);
          }}
        />
        <FilterSection className={`${isMobile ? "flex" : "hidden"}`} filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />
      </div>
    </>
  );
}
