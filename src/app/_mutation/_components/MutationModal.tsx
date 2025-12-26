"use client";
import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import { sharedFields, incomeFields, outcomeFields } from "./MutationColumns";
import { Plus } from "lucide-react";
import { useMutationVM } from "../_viewModel/useMutationVm";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<typeof useMutationVM>;
}

export default function MutationModal({ isOpen, onClose, vm }: IncomeModalProps) {
  const { mutationForm, onSubmit, mode } = vm;
  const { handleSubmit } = mutationForm;

  const fields = [...(mode === "income" ? incomeFields : []),
   ...(mode === "outcome" ? outcomeFields : []), ...sharedFields];

  const isMobile = useIsMobile();
  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      cancelText="Batal"
      submitText={mode === "income" ? "Simpan Pemasukan" : "Simpan Pengeluaran"}
      submitIcon={<Plus />}
      onSubmit={handleSubmit(onSubmit)}
      title={mode === "income" ? "Catat Pemasukan" : "Catat Pengeluaran"}
      isAction={false}
    >
      <DynamicForm fields={fields} form={mutationForm} />
    </ModalComponent>
  );
}
