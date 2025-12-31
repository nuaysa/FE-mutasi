"use client";

import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import { sharedFields, incomeFields, expenseFields } from "./MutationColumns";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { useEffect } from "react";

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<any>;
}

export default function MutationModal({ isOpen, onClose, vm }: IncomeModalProps) {
  const { mutationForm, onSubmit, mode } = vm;
  const { handleSubmit, watch, setValue } = mutationForm;
  const selectedVendor = watch("vendorId");
  const selectedSantri = watch("santriId");

  useEffect(() => {
    if (selectedVendor) {
      setValue("santriId", null);
    }
  }, [selectedVendor, setValue]);
  const incomeField = incomeFields.map((field) => {
    if (field.name === "categoryId") {
      return { ...field, options: vm.categoryOptions };
    }
    if (field.name === "debtId") {
      return { ...field, options: vm.debtOptions };
    }
    return field;
  });

  const expenseField = expenseFields.map((field) => {
    if (field.name === "categoryId") {
      return { ...field, options: vm.categoryOptions };
    }
    if (field.name === "vendorId") {
      return { ...field, options: vm.vendorOptions };
    }
    return field;
  });

  const sharedField = sharedFields.map((field) => {
    if ( mode === "expense") {
      if(field.name === "santriId") {
      return {
        ...field,
        options: selectedVendor ? [] : vm.santriOptions,
        disabled: !!selectedVendor,
        placeholder: selectedVendor ? "Nonaktif karena Vendor dipilih" : field.placeholder,
      };}
      if (field.name === "vendorId") { 
        return {
          ...field,
          options: selectedSantri ? [] : vm.vendorOptions,
          disabled: !!selectedSantri,
          placeholder: selectedSantri ? "Nonaktif karena Santri dipilih" : field.placeholder,
        };
      }
    }

    if (field.name === "santriId" && mode === "income") {
      return {
        ...field,
        options: vm.santriOptions,
      };
    }

    if (field.name === "purpose" && mode === "income") {
      return {
        ...field,
        options: [
          { value: "deposit_topup", label: "Isi Saldo" },
          { value: "debt_created", label: "Buat Hutang" },
          { value: "debt_payment", label: "Bayar Hutang" },
          { value: "other", label: "Lainnya" },
        ],
      };
    }

    if (field.name === "purpose" && mode === "expense" && !selectedVendor) {
      return {
        ...field,
        options: [
          { value: "deposit_withdrawal", label: "Tarik Saldo" },
          { value: "other", label: "Lainnya" },
        ],
      };
    }

    if (field.name === "purpose" && mode === "expense" && selectedVendor) {
      return {
        ...field,
        options: [{ value: "other", label: "Lainnya" }],
      };
    }

    return field;
  });

  const fields = [...(mode === "income" ? incomeField : []), ...(mode === "expense" ? expenseField : []), ...sharedField];

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
