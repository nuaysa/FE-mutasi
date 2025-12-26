"use client";

import Button from "@/components/commons/Button";
import FilterSection from "@/components/commons/FilterSection";
import Table from "@/components/commons/Table/Table";
import { useAuthContext } from "@/contexts/AuthContext";
import { MinusCircle, PlusCircle } from "lucide-react";
import { hasMultiplePages } from "@/utils/helpers";
import Pagination from "@/components/commons/Pagination";
import { useMutationVM } from "./_mutation/_viewModel/useMutationVm";
import { getMutationColumns } from "./_mutation/_components/MutationColumns";
import MutationModal from "./_mutation/_components/MutationModal";
import { mutationDummy } from "@/components/dummy/Mutations";
import { useIsMobile } from "@/hooks/useIsMobile";

// export default withAuth(EventPage, {
//   role: [ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.USER],
// });

export default function home() {
  const vm = useMutationVM();

  const { isAdmin, isSuperAdmin, isAuthenticated } = useAuthContext();
  const isMobile = useIsMobile();
  return (
    <>
      <div className="mx-2 md:px-0 flex flex-col md:flex-row gap-3 lg:gap-0 justify-center items-center md:justify-between mb-6">
        <h1 className="text-2xl text-neutral-black font-bold">Mutasi Keuangan</h1>
        <div className={`${isMobile ? "hidden" : "flex"} gap-3`}>
          <Button
            text="Pemasukan"
            icon={<PlusCircle />}
            onClick={() => {
              vm.setMode("income");
              vm.setIsCreateModalOpen(true);
            }}
          />
          <Button
            text="Pengeluaran"
            icon={<MinusCircle />}
            variant="DANGER"
            onClick={() => {
              console.log(vm.mode)
              vm.setMode("outcome");
              vm.setIsCreateModalOpen(true);
            }}
          />
        </div>
      </div>

        <div className={`${isMobile ? "hidden" : "flex"}  mb-5`}>
      <FilterSection filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />
      </div>

      <Table
        columns={getMutationColumns()}
        data={mutationDummy || vm.mutations}
        isLoading={vm.isLoading}
        title="Event"
        isFiltering={vm.isFiltering}
        onReset={vm.handleReset}
      />
      {vm.mutations && vm.mutations.length !== 0 && hasMultiplePages(vm.totalItems, vm.pageSize) && (
        <Pagination totalItems={vm.totalItems} currentPage={vm.currentPage} perPage={vm.pageSize} onPageChange={vm.handlePageChange} onPerPageChange={vm.handlePageSizeChange} />
      )}

      <MutationModal isOpen={vm.isCreateModalOpen} onClose={() => vm.setIsCreateModalOpen(false)} vm={vm} />
   
      <div className={`${isMobile ? "flex" : "hidden"} justify-between items-center border-t px-3 border-primary-surface bg-white fixed bottom-0 py-2 w-full gap-2 z-20`}>
        <Button
          className="w-1/2"
          text="Pengeluaran"
          icon={<MinusCircle />}
          variant="DANGER"
          onClick={() => {
            vm.setMode("outcome");
            vm.setIsCreateModalOpen(true);
          }}
        />
        <Button
          className="w-1/2"
          text="Pemasukan"
          icon={<PlusCircle />}
          onClick={() => {
            vm.setMode("income");
            vm.setIsCreateModalOpen(true);
          }}
        />
          <FilterSection  className={`${isMobile ? "flex" : "hidden"}`} filters={vm.filterFields} values={vm.filterValues} onFilterChange={vm.handleFilterChange} onReset={vm.handleReset} />
      </div>
    </>
  );
}
