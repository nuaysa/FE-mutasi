"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/commons/BaseModal";
import BottomSheetModal from "@/components/commons/BottomSheet";
import DynamicForm from "@/components/commons/Form/Form";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  sharedFields,
  incomeFields,
  expenseFields,
} from "./MutationColumns";
import {
  getIncomeFieldOptions,
  getExpenseFieldOptions,
  getPurposeOptions,
} from "@/utils/fieldHelpers";
import ExpenseTabs from "./ExpenseTab";

interface MutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<any>;
}

type ExpenseTab = "santri" | "umum";

export default function MutationModal({
  isOpen,
  onClose,
  vm,
}: MutationModalProps) {
  const { mutationForm, onSubmit, mode } = vm;
  const { handleSubmit } = mutationForm;

  const isMobile = useIsMobile();
  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  const [expenseTab, setExpenseTab] = useState<ExpenseTab>("santri");

  const processedIncomeFields = useMemo(
    () => incomeFields.map((f) => getIncomeFieldOptions(f, vm)),
    [vm]
  );

  const processedExpenseFields = useMemo(
    () => expenseFields.map((f) => getExpenseFieldOptions(f, vm)),
    [vm]
  );

  const processedSharedFields = useMemo(
    () =>
      sharedFields.map((field) => {
        if (field.name === "santriId") {
          return { ...field, options: vm.santriOptions };
        }
        if (field.name === "vendorId") {
          return { ...field, options: vm.vendorOptions };
        }
        if (field.name === "purpose") {
            return { ...field, options: getPurposeOptions(mode, expenseTab ==="umum" ? true : false)};
        }
        return field;
      }),
    [vm, mode, expenseTab]
  );

  const expenseSantriShared = processedSharedFields.filter(
    (f) => f.name !== "vendorId"
  );

  const expenseUmumShared = processedSharedFields.filter(
    (f) => f.name !== "santriId"
  );

  const fields = useMemo(() => {
    if (mode === "income") {
      return [...processedIncomeFields, ...processedSharedFields];
    }

    if (mode === "expense") {
      if (expenseTab === "santri") {
        return [...processedExpenseFields, ...expenseSantriShared];
      }
      return [...processedExpenseFields, ...expenseUmumShared];
    }

    return [];
  }, [
    mode,
    expenseTab,
    processedIncomeFields,
    processedExpenseFields,
    processedSharedFields,
    expenseSantriShared,
    expenseUmumShared,
  ]);

  useEffect(() => {
    if (mode !== "expense") return;

    if (expenseTab === "santri") {
      mutationForm.setValue("vendorId", null);
    } else {
      mutationForm.setValue("santriId", null);
    }
  }, [expenseTab, mode, mutationForm]);

  const modalTitle =
    mode === "income" ? "Catat Pemasukan" : "Catat Pengeluaran";
  const submitText =
    mode === "income" ? "Simpan Pemasukan" : "Simpan Pengeluaran";

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      submitText={submitText}
      submitIcon={<Plus />}
      cancelText="Batal"
      onSubmit={handleSubmit(onSubmit)}
      isAction={false}
    >
      {mode === "expense" && (
        <ExpenseTabs
          value={expenseTab}
          onChange={setExpenseTab}
        />
      )}

      <DynamicForm fields={fields} form={mutationForm} />
    </ModalComponent>
  );
}
