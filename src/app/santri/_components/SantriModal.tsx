"use client";
import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import { Plus } from "lucide-react";
import { useSantriVM } from "../_viewModel/useSantriVm";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { santriFields } from "./SantriColumns";
import { useEffect } from "react";

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<typeof useSantriVM>;
}

export default function SantriCreateModal({ isOpen, onClose, vm }: IncomeModalProps) {
  const { santriForm, onSubmit, mode, currentSantri } = vm;
  const { handleSubmit, reset } = santriForm;
  useEffect(() => {
    if (isOpen && mode === "edit" && currentSantri) {
      reset({
        name: currentSantri.name,
        grade: currentSantri.grade,
        status: currentSantri.status,
        generation: currentSantri.generation,
      });
    }
    if (isOpen && mode === "create") {
      reset({
        name: "",
        grade: "",
        status: "",
        generation: undefined,
      });
    }
  }, [isOpen, mode, currentSantri, reset]);

  const isMobile = useIsMobile();
  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      cancelText="Batal"
      submitText={mode === "create" ? "Tambah Santri" : "Simpan perubahan"}
      submitIcon={mode === "create" ? <Plus /> : undefined}
      onSubmit={handleSubmit(onSubmit)}
      title={mode === "create" ? "Tambah Data Santri" : "Ubah Data Santri"}
      isAction={false}
    >
      <DynamicForm fields={santriFields} form={santriForm} />
    </ModalComponent>
  );
}
