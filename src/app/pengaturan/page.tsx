"use client";

import { useSettingVM } from "./_viewModel/useSettingVm";
import SettingsCards from "./_components/SettingsCards";
import SettingsCreateModal from "./_components/SettingsModal";
import ConfirmationModal from "@/components/commons/Modal";

export default function home() {
  const vm = useSettingVM();

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
