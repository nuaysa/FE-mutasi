"use client";

import { useUserVM } from "./_viewModel/useUserVm";
import UserCards from "./_components/UsersCards";
import UserCreateModal from "./_components/UsersModal";
import ConfirmationModal from "@/components/commons/Modal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PlusCircle } from "lucide-react";
import Button from "@/components/commons/Button";
import { ROLE } from "@/utils/constant";
import { withAuth } from "@/components/hoc/withAuth";

export default withAuth(Home, {
  role: [ROLE.ADMIN],
});

function Home() {
  const vm = useUserVM();
  const { isAdmin } = useAuthContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-2 md:px-0 flex flex-col md:flex-row gap-3 lg:gap-0 justify-center items-center md:justify-between mb-6">
          <h1 className="text-2xl text-neutral-black font-bold mb-5">
            Kelola User
          </h1>
          <div className={`${isMobile || !isAdmin ? "hidden" : "flex"} gap-3`}>
            <Button
              text="Tambah User"
              icon={<PlusCircle />}
              onClick={() => {
                vm.setIsCreateModalOpen(true);
              }}
            />
          </div>
        </div>
        <UserCards vm={vm} />
      </div>

      <div
        className={`${
          !isMobile || !isAdmin
            ? "hidden"
            : "sticky bottom-0 left-0 right-0 z-20"
        }`}
      >
        <div className="bg-white border-t border-primary-surface px-3 py-3">
          <Button
            className="w-full"
            text="Tambah User"
            icon={<PlusCircle />}
            onClick={() => {
              vm.setIsCreateModalOpen(true);
            }}
          />
        </div>
      </div>

      <UserCreateModal
        isOpen={vm.isCreateModalOpen}
        onClose={() => vm.setIsCreateModalOpen(false)}
        vm={vm}
      />
      <ConfirmationModal
        isOpen={vm.isModalOpen}
        onClose={() => vm.setIsModalOpen(false)}
        variant="danger"
        title="Hapus Data?"
        description={
          <>
            Ketik <strong> "HAPUS"</strong> untuk konfirmasi lalu pilih
            <strong> "Ya, Hapus"</strong>.
          </>
        }
        confirmText="Ya, Hapus"
        confirmationText="HAPUS"
        cancelText="Batal"
        onConfirm={() => {
          vm.handleDelete(vm.selectedItem?.id!);
        }}
      />
    </div>
  );
}