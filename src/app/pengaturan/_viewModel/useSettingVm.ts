"use client";

import { useState, useCallback, useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import type { Setting } from "../model";
import { useSettingForm } from "../_components/SettingsSchema";
import { createCategory, deleteCategory, editCategory, getCategories } from "@/api/category";
import { createVendor, deleteVendor, editVendor, getVendors } from "@/api/vendor";

export const useSettingVM = () => {
  const [categories, setCategories] = useState<Setting[]>([]);
  const [vendors, setVendors] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [type, setType] = useState<"category" | "vendor">("category");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<Setting | null>(null);

  const { showToast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await getCategories();

      if (response && response.data) {
        setCategories(response.data);
        setTotalItems(response.data.length);
      }
    } catch (error: any) {
      showToast(error.message || "Gagal mengambil data kategori", "ERROR");
    } finally {
      setIsLoadingData(false);
    }
  }, [ showToast]);

  const fetchVendors = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await getVendors();

      if (response && response.data) {
        setVendors(response.data);
        setTotalItems( response.data.length);
      }
    } catch (error: any) {
      showToast(error.message || "Gagal mengambil data vendor", "ERROR");
    } finally {
      setIsLoadingData(false);
    }
  }, [ showToast]);

  const fetchData = useCallback(async () => {
    await fetchCategories();

      await fetchVendors();
    
  }, [type, fetchCategories, fetchVendors]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

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

  const SettingForm = useSettingForm();

  const onSubmit: SubmitHandler<Setting> = useCallback(
    async (data) => {
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
            await createCategory(newCategory);
            showToast("Kategori berhasil ditambahkan!", "SUCCESS");
          } else {
            await editCategory(selectedItem!.id!, payload);
            showToast("Kategori berhasil diperbarui!", "SUCCESS");
          }
        } else if (type === "vendor") {
          if (mode === "create") {
            const newVendor = {
              ...payload,
            };
            await createVendor(newVendor);
            showToast("Vendor berhasil ditambahkan!", "SUCCESS");
          } else {
             await editVendor(selectedItem!.id!, payload)
            showToast("Vendor berhasil diperbarui!", "SUCCESS");
          }
        }

        setIsCreateModalOpen(false);
        SettingForm.reset();

        await refreshData();
      } catch (error: any) {
        showToast(error.message || "Terjadi kesalahan", "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [type, mode, selectedItem, SettingForm, showToast, refreshData]
  );

  const handleDelete = useCallback(
    async (id: string, itemType: "category" | "vendor") => {
      setIsLoading(true);
      try {
        if (itemType === "category") {
          await deleteCategory(id);
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          showToast("Kategori berhasil dihapus!", "SUCCESS");
        } else {
          await deleteVendor(id);
          setVendors((prev) => prev.filter((ven) => ven.id !== id));
          showToast("Vendor berhasil dihapus!", "SUCCESS");
        }

        await refreshData();
      } catch (error: any) {
        showToast(error.message || "Terjadi kesalahan saat menghapus", "ERROR");
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    },
    [showToast, refreshData]
  );

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

  const handleTypeChange = useCallback((newType: "category" | "vendor") => {
    setType(newType);
  }, []);

  return {
    categories,
    vendors,
    isLoading,
    isLoadingData,
    isCreateModalOpen,
    isModalOpen,
    isDetailModalOpen,
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
    handleTypeChange,
    refreshData,
    fetchCategories,
    fetchVendors,
  };
};
