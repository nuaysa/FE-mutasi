"use client";
import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import { Plus, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { useUserVM } from "../_viewModel/useUserVm";
import { useEffect } from "react";
import { fields } from "./UsersColumns";

interface UsersCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<typeof useUserVM>;
}

export default function UsersCreateModal({ isOpen, onClose, vm }: UsersCreateModalProps) {
  const { UserForm, onSubmit,  mode, selectedItem } = vm;
  const { handleSubmit, reset } = UserForm;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && selectedItem) {
        reset({
          name: selectedItem.name,
          password: selectedItem.password,
          email: selectedItem.email,
          role: selectedItem.role,
        });
      } else {
        reset({
          name: "",
          role: "user",
          password: "",
          email: "",
        });
      }
    }
  }, [isOpen, mode, selectedItem, reset]);

  const getModalConfig = () => {

    if (mode === "create") {
      return {
        title: `Tambah User`,
        submitText: `Tambah User`,
        submitIcon: <Plus size={18} />,
      };
    } else {
      return {
        title: `Edit User`,
        submitText: `Simpan Perubahan`,
        submitIcon: <Save size={18} />,
      };
    }
  };

  const modalConfig = getModalConfig();

  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      cancelText="Batal"
      submitText={modalConfig.submitText}
      submitIcon={modalConfig.submitIcon}
      onSubmit={handleSubmit(onSubmit)}
      title={modalConfig.title}
      isAction={false}
    >
      <DynamicForm fields={fields} form={UserForm} />
    </ModalComponent>
  );
}
