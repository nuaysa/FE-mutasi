"use client";

import { useState, useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import type { Setting } from "../model";
import { useSettingForm } from "../_components/SettingsSchema";
import { dummyCategories, dummyVendors } from "@/components/dummy/Settings";

export const useSettingVM = () => {
  const [categories, setCategories] = useState<Setting[]>(dummyCategories);
  const [vendors, setVendors] = useState<Setting[]>(dummyVendors);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [type, setType] = useState<"category" | "vendor">("category");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<Setting | null>(dummyCategories[0]);
  
  const { showToast } = useToast();

  const handleOpenCreateModal = useCallback((settingType: "category" | "vendor") => {
    setType(settingType);
    setMode("create");
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((item: Setting, settingType: "category" | "vendor") => {
    setType(settingType);
    setMode("edit");
    setSelectedItem(item);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenDetailModal = useCallback((item: Setting) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const SettingForm = useSettingForm();

  const onSubmit: SubmitHandler<Setting> = useCallback(async (data) => {
    setIsLoading(true);

    try {
      const payload: Setting = {
        ...data,
        id: selectedItem?.id,
      };

      if (type === "category") {
        if (mode === "create") {
          const newCategory = {
            ...payload,
          };
          setCategories(prev => [...prev, newCategory]);
          showToast("Kategori berhasil ditambahkan!", "SUCCESS");
        } else {
          setCategories(prev => 
            prev.map(cat => cat.id === selectedItem?.id ? { ...cat, ...payload } : cat)
          );
          showToast("Kategori berhasil diperbarui!", "SUCCESS");
        }
      } else if (type === "vendor") {
        if (mode === "create") {
          const newVendor = {
            ...payload,
          };
          setVendors(prev => [...prev, newVendor]);
          showToast("Vendor berhasil ditambahkan!", "SUCCESS");
        } else {
          setVendors(prev => 
            prev.map(ven => ven.id === selectedItem?.id ? { ...ven, ...payload } : ven)
          );
          showToast("Vendor berhasil diperbarui!", "SUCCESS");
        }
      }

      setIsCreateModalOpen(false);
      SettingForm.reset();
      
    } catch (error: any) {
      showToast(error.message || "Terjadi kesalahan", "ERROR");
    } finally {
      setIsLoading(false);
    }
  }, [type, mode, selectedItem, SettingForm, showToast]);

  const handleDelete = useCallback(async (id: string, itemType: "category" | "vendor") => {

    setIsLoading(true);
    try {
      if (itemType === "category") {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        showToast("Kategori berhasil dihapus!", "SUCCESS");
      } else {
        setVendors(prev => prev.filter(ven => ven.id !== id));
        showToast("Vendor berhasil dihapus!", "SUCCESS");
      }
    } catch (error: any) {
      showToast(error.message || "Terjadi kesalahan saat menghapus", "ERROR");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false)
    }
  }, [showToast]);

  const handleDownloadAll = async () => {
    try {
      setIsLoading(true);
      showToast("Download berhasil!", "SUCCESS");
    } catch (error: any) {
      showToast(error.message || "Terjadi kesalahan saat download", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    vendors,
    isLoading,
    isCreateModalOpen,
    isModalOpen,
    isDetailModalOpen,
    currentPage,
    pageSize,
    totalItems,
    type,
    mode,
    selectedItem,
    SettingForm,
    
    setType,
    setMode,
    setSelectedItem,
    setIsLoading,
    setIsCreateModalOpen,
    setIsModalOpen,
    setIsDetailModalOpen,
    
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleDelete,
    handleDownloadAll,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
  };
};