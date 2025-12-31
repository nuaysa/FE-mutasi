"use client";

import { useState, useCallback, useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import type { User } from "../model";
import { createUser, deleteUser, editUser, getAllUsers } from "@/api/users";
import { InputUserParams } from "@/api/types/types";
import { useUserForm } from "../_components/UsersSchema";

export const useUserVM = () => {
  const [User, setUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<User | null>(null);

  const { showToast } = useToast();

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await getAllUsers();

      if (response && response.data) {
        setUser(response.data);
        setTotalItems(response.data.length);
      }
    } catch (error: any) {
      showToast(error.message || "Gagal mengambil data User", "ERROR");
    } finally {
      setIsLoadingData(false);
    }
  }, [showToast]);

  const fetchData = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleOpenCreateModal = useCallback(() => {
    setMode("create");
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((item: User ) => {
    setMode("edit");
    setSelectedItem(item);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenDetailModal = useCallback((item: User) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  }, []);

  const UserForm = useUserForm();

  const onSubmit: SubmitHandler<InputUserParams> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        const payload: InputUserParams = {
          ...data,
          id: selectedItem?.id,
        };

        if (mode === "create") {
          const newUser = {
            ...payload,
          };
          await createUser(newUser);
          showToast("user berhasil ditambahkan!", "SUCCESS");
        } else {
          await editUser({ id: selectedItem!.id!, data: payload });
          showToast("user berhasil diperbarui!", "SUCCESS");
        }

        setIsCreateModalOpen(false);
        UserForm.reset();

        await refreshData();
      } catch (error: any) {
        showToast(error.message || "Terjadi kesalahan", "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [mode, selectedItem, UserForm, showToast, refreshData]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        await deleteUser(id);
        setUser((prev) => prev.filter((cat) => cat.id !== id));
        showToast("User berhasil dihapus!", "SUCCESS");

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

  return {
    User,
    isLoading,
    isLoadingData,
    isCreateModalOpen,
    isModalOpen,
    isDetailModalOpen,
    totalItems,

    mode,
    selectedItem,
    UserForm,

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
    refreshData,
    fetchUser,
  };
};
