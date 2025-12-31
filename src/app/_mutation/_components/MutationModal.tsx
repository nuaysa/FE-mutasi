"use client";

import { Plus } from "lucide-react";
import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { sharedFields, incomeFields, expenseFields } from "./MutationColumns";
import { getIncomeFieldOptions, getExpenseFieldOptions, getPurposeOptions } from "@/utils/fieldHelpers";
import { useEffect } from "react";

interface MutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<any>;
}

export default function MutationModal({ isOpen, onClose, vm }: MutationModalProps) {
  const { mutationForm, onSubmit, mode } = vm;
  const { handleSubmit, watch } = mutationForm;

  const isMobile = useIsMobile();
  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  const selectedVendor = watch("vendorId");
  const selectedSantri = watch("santriId");
  const selectedPurpose = watch("purpose");

  const isExpense = mode === "expense";
  const hasSantri = !!selectedSantri && selectedSantri !== "";
  const hasPurposeBlocking = selectedPurpose && selectedPurpose !== "other";

  const disableVendor = isExpense && (hasPurposeBlocking || hasSantri);
  const disableSantri = isExpense && !!selectedVendor;
  console.log({
    mode,
    selectedSantri,
    selectedVendor,
    disableVendor,
    disableSantri,
  });
  useEffect(() => {
    if (disableVendor && selectedVendor) {
      mutationForm.setValue("vendorId", null);
    }
  }, [disableVendor]);

  useEffect(() => {
    if (disableSantri && selectedSantri) {
      mutationForm.setValue("santriId", null);
    }
  }, [disableSantri]);

  const processedIncomeFields = incomeFields.map((field) => getIncomeFieldOptions(field, vm));

  const processedExpenseFields = expenseFields.map((field) => getExpenseFieldOptions(field, vm));

  const processedSharedFields = sharedFields.map((field) => {
    if (field.name === "santriId") {
      return {
        ...field,
        options: vm.santriOptions,
        disabled: disableSantri,
        placeholder: disableSantri ? "Nonaktif karena Vendor dipilih" : field.placeholder,
      };
    }

    if (field.name === "vendorId") {
      return {
        ...field,
        options: vm.vendorOptions,
        disabled: disableVendor,
        placeholder: disableVendor ? (selectedSantri ? "Nonaktif karena Santri dipilih" : "Hanya aktif jika purpose = Lainnya") : field.placeholder,
      };
    }

    if (field.name === "purpose") {
      return {
        ...field,
        options: getPurposeOptions(mode, selectedVendor),
      };
    }

    return field;
  });

  const fields = [...(mode === "income" ? processedIncomeFields : []), ...(mode === "expense" ? processedExpenseFields : []), ...processedSharedFields];

  const modalTitle = mode === "income" ? "Catat Pemasukan" : "Catat Pengeluaran";
  const submitText = mode === "income" ? "Simpan Pemasukan" : "Simpan Pengeluaran";

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={modalTitle} submitText={submitText} submitIcon={<Plus />} cancelText="Batal" onSubmit={handleSubmit(onSubmit)} isAction={false}>
      <DynamicForm fields={fields} form={mutationForm} />
    </ModalComponent>
  );
}
