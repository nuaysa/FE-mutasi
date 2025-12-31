"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import { Santri } from "../model";
import { GetAllsantrisParams } from "@/api/types/types";
import { usesantriForm } from "../_components/SantriSchema";
import { createStudent, editStudent, getAllStudents, getStudentById } from "@/api/santri";
import { getSantriPdf } from "@/api/pdf";
import { downloadPdf, generateYearOptions } from "@/utils/helpers";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const useSantriVM = () => {
  const [santris, setSantris] = useState<Santri[] | null>([]);
  const [currentSantri, setCurrentSantri] = useState<Santri | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { showToast } = useToast();

  const filterFields = [
    {
      key: "search",
      label: "search",
      type: "text" as const,
      placeholder: "Cari Nama Santri",
    },
    {
      key: "status",
      label: "status",
      type: "select" as const,
      options: [
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Cuti" },
        { value: "graduated", label: "Lulus" },
        { value: "stopped", label: "Keluar" },
      ],
      placeholder: "Pilih Status",
    },
    {
      key: "grade",
      label: "Kelas",
      type: "select" as const,
      options: [
        { value: "10 BAHASA 3", label: "10 BAHASA 3" },
        { value: "11 BAHASA 3", label: "11 BAHASA 3" },
        { value: "12 BAHASA 3", label: "12 BAHASA 3" },
      ],
      placeholder: "Pilih Kelas",
    },
    {
      key: "generation",
      label: "Angkatan",
      type: "select" as const,
      options: generateYearOptions(2012),
      placeholder: "Pilih Angkatan",
    },
  ];

  const initialFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));
  const [filterValues, setFilterValues] = useState(initialFilters);
  const isFiltering = Object.values(filterValues).some((val) => val !== "" && val !== null && val !== undefined);

  const debouncedFilters = useDebounce(filterValues, 500);

  const buildApiParams = useCallback((filters: Record<string, string | string[]>, page: number, size: number): GetAllsantrisParams => {
    const params: GetAllsantrisParams = {
      page,
      size,
    };

    if (filters.search && filters.search !== "") {
      params.search = filters.search as string;
    }
    if (filters.status && filters.status !== "") {
      params.status = filters.status as string;
    }
    if (filters.grade && filters.grade !== "") {
      params.grade = filters.grade as string;
    }
    if (filters.generation && filters.generation !== "") {
      params.generation = filters.generation as string;
    }

    return params;
  }, []);

  const fetchSantris = useCallback(
    async (params?: GetAllsantrisParams) => {
      setIsLoading(true);
      try {
        const apiParams = params || buildApiParams(debouncedFilters, currentPage, pageSize);

        const response = await getAllStudents(apiParams);

        if (response.data.items === null) {
          setSantris(null);
          setTotalItems(response.meta.total);
        } else {
          setSantris(response.data);
          setTotalItems(response.meta.total);
        }
      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [buildApiParams, currentPage, pageSize, showToast, debouncedFilters]
  );

  useEffect(() => {
    const params = buildApiParams(debouncedFilters, currentPage, pageSize);
    fetchSantris(params);
  }, [debouncedFilters, currentPage, pageSize, fetchSantris, buildApiParams]);

  const handleView = async (santri: Santri) => {
    try {
      const detail = await getStudentById(santri.id!);
      setCurrentSantri(detail.data);
      setIsDetailModalOpen(true);
    } catch (error: any) {
      showToast(error.message, "ERROR");
      setIsDetailModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    const normalizedValue = Array.isArray(value) ? value.join(",") : value;
    setFilterValues((prev) => ({
      ...prev,
      [key]: normalizedValue,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  const handleReset = () => {
    setFilterValues(initialFilters);
    setCurrentPage(1);
  };

  const santriForm = usesantriForm();

  const onSubmit: SubmitHandler<Santri> = async (data) => {
    setIsLoading(true);

    try {
      const payload: Santri = {
        name: data.name,
        grade: data.grade,
        status: data.status,
        generation: data.generation,
      };
      if (mode === "create") {
        await createStudent(payload);
        showToast("Santri berhasil ditambahkan!", "SUCCESS");
      } else if (mode === "edit" && currentSantri?.id) {
        await editStudent({ id: currentSantri?.id, data: payload });
        showToast("Santri berhasil diubah!", "SUCCESS");
      }
      setIsCreateModalOpen(false);
      santriForm.reset();
      fetchSantris();
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSantriReport = async () => {
    try {
      setIsLoading(true);
      if (!currentSantri?.id) {
        showToast("Data santri tidak tersedia", "ERROR");
        return;
      }
      const response = await getSantriPdf(currentSantri.id);

      const safeName = currentSantri.name ? currentSantri.name.replace(/\s+/g, "-").toLowerCase() : currentSantri.name;

      const filename = `laporan-santri-${safeName}-${Date.now()}.pdf`;
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      downloadPdf(blob, filename);
      showToast("PDF laporan berhasil diunduh", "SUCCESS");
    } catch (error: any) {
      console.error("Download error:", error);
      showToast(error.message || "Gagal mengunduh laporan PDF", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    santris,
    currentSantri,
    santriForm,
    filterValues,
    filterFields,
    mode,
    isLoading,
    isModalOpen,
    isDeleteModalOpen,
    isWarningModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    currentPage,
    pageSize,
    isFiltering,
    totalItems,

    handleDownloadSantriReport,

    handleFilterChange,
    handleReset,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
    handleView,

    setIsLoading,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsWarningModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    setMode,
    setCurrentSantri,
  };
};
