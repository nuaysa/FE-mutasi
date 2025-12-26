"use client";
import BaseModal from "@/components/commons/BaseModal";
import DynamicForm from "@/components/commons/Form/Form";
import { Plus, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { useSettingVM } from "../_viewModel/useSettingVm";
import { CategoryFields, VendorFields } from "./SettingColumns";
import { useEffect } from "react";

interface SettingsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<typeof useSettingVM>;
}

export default function SettingsCreateModal({ 
  isOpen, 
  onClose, 
  vm 
}: SettingsCreateModalProps) {
  const { SettingForm, onSubmit, type, mode, selectedItem } = vm;
  const { handleSubmit, reset } = SettingForm;
  const isMobile = useIsMobile();

  const fields = type === "category" ? CategoryFields : VendorFields;

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && selectedItem) {
       reset({
          name: selectedItem.name,
        });
      } else {
        
        reset({
          name: "",
        });
      }
    }
  }, [isOpen, mode, selectedItem, type, reset]);

  const getModalConfig = () => {
    const typeText = type === "category" ? "Kategori" : "Vendor";
    
    if (mode === "create") {
      return {
        title: `Tambah ${typeText}`,
        submitText: `Tambah ${typeText}`,
        submitIcon: <Plus size={18} />,
      };
    } else {
      return {
        title: `Edit ${typeText}`,
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
      <DynamicForm fields={fields} form={SettingForm} />
    </ModalComponent>
  );
}