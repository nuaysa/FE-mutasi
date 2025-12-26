"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { hasMultiplePages } from "@/utils/helpers";
import Pagination from "@/components/commons/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSettingVM } from "./_viewModel/useSettingVm";
import SettingsCards from "./_components/SettingsCards";
import SettingsCreateModal from "./_components/SettingsModal";
import ConfirmationModal from "@/components/commons/Modal";
// export default withAuth(EventPage, {
//   role: [ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.USER],
// });

export default function home() {
  const vm = useSettingVM();

  const { isAdmin, isSuperAdmin, isAuthenticated } = useAuthContext();
  const isMobile = useIsMobile();
  return (
    <>
      <h1 className="text-2xl text-neutral-black font-bold mb-5">Pengaturan Sistem</h1>

      <SettingsCards vm={vm} />

      <SettingsCreateModal isOpen={vm.isCreateModalOpen} onClose={() => vm.setIsCreateModalOpen(false)} vm={vm} />
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
            vm.handleDelete(vm.selectedItem?.id ?? "", vm.type);
          }}
        />
    </>
  );
}
