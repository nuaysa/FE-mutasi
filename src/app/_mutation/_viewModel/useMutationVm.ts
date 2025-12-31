"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { SortConfig } from "@/components/commons/Table/Table";
import { useToast } from "@/contexts/ToastContext";
import { Mutation } from "../model";
import { useMutationForm } from "../_components/MutationSchema";
import { debt, GetAllmutationsParams, InputMutationParams } from "@/api/types/types";
import { createMutation, getAllMutations, getSantriDebts } from "@/api/mutasi";
import { getAllStudents } from "@/api/santri";
import { Santri } from "@/app/santri/model";
import { getCategories } from "@/api/category";
import { Setting } from "@/app/pengaturan/model";
import { getVendors } from "@/api/vendor";
import { getAllTransactionsPdf, getTransactionsPdf } from "@/api/pdf";
import { downloadPdf, formatFilterDate } from "@/utils/helpers";

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

export const useMutationVM = () => {
  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isexpenseModalOpen, setIsexpenseModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"income" | "expense">("income");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [santriOptions, setSantriOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [vendorOptions, setVendorOptions] = useState<{ value: string; label: string }[]>([]);
  const [debtOptions, setDebtOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedMutation, setSelectedMutation] = useState<Mutation | null>(null); // Untuk menyimpan transaksi yang dipilih
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "createdAt",
    direction: "desc",
  });

  const { showToast } = useToast();
  const hasFetchedInitialData = useRef(false);

  const filterFields = [
    {
      key: "date",
      label: "Rentang Waktu",
      dateType: "single" as const,
      type: "date" as const,
      placeholder: "Rentang Waktu",
    },
    {
      key: "type",
      label: "Jenis Transaksi",
      type: "select" as const,
      options: [
        { value: "income", label: "Pemasukan" },
        { value: "expense", label: "Pengeluaran" },
      ],
      placeholder: "Jenis Transaksi",
    },
    {
      key: "categoryId",
      label: "Kategori",
      type: "select" as const,
      placeholder: "Kategori",
      options: categoryOptions,
    },
    {
      key: "vendorId",
      label: "Vendor/Pihak Ke-3",
      type: "select" as const,
      placeholder: "Vendor/Pihak Ke-3",
      options: vendorOptions,
    },
  ];

  const initialFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));

  const [filterValues, setFilterValues] = useState(initialFilters);
  const isFiltering = Object.values(filterValues).some((val) => val !== "" && val !== null && val !== undefined);

  const debouncedFilters = useDebounce(filterValues, 500);

  const buildApiParams = useCallback((filters: Record<string, string | string[]>, page: number, size: number): GetAllmutationsParams => {
    const params: GetAllmutationsParams = {
      page,
      size,
    };

    if (filters.vendorId && filters.vendorId !== "") {
      params.vendorId = filters.vendorId as string;
    }

    if (filters.type && filters.type !== "") {
      params.type = filters.type as string;
    }

    if (filters.categoryId && filters.categoryId !== "") {
      params.categoryId = filters.categoryId as string;
    }

    if (filters.date && filters.date !== "") {
      params.date = filters.date.slice(0, 10) as string;
    }

    return params;
  }, []);

  const fetchMutations = useCallback(
    async (params?: GetAllmutationsParams) => {
      setIsLoading(true);
      try {
        const apiParams = params || buildApiParams(debouncedFilters, currentPage, pageSize);
        const response = await getAllMutations(apiParams);

        setMutations(response.data);
        setTotalItems(response.meta.total);
      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [buildApiParams, currentPage, pageSize, showToast, debouncedFilters]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      if (hasFetchedInitialData.current) return;

      try {
        setIsLoading(true);

        const categoriesRes = await getCategories();
        setCategoryOptions(
          categoriesRes.data.map((c: Setting) => ({
            value: c.id,
            label: c.name,
          }))
        );

        const vendorsRes = await getVendors();
        setVendorOptions(
          vendorsRes.data.map((v: Setting) => ({
            value: v.id,
            label: v.name,
          }))
        );

        const params = buildApiParams(initialFilters, currentPage, pageSize);
        const mutationsRes = await getAllMutations(params);
        setMutations(mutationsRes.data);
        setTotalItems(mutationsRes.meta.total);

        hasFetchedInitialData.current = true;
      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [buildApiParams, currentPage, pageSize, showToast]);

  useEffect(() => {
    if (!hasFetchedInitialData.current) return;

    const params = buildApiParams(debouncedFilters, currentPage, pageSize);
    fetchMutations(params);
  }, [debouncedFilters, currentPage, pageSize, buildApiParams, fetchMutations]);

  useEffect(() => {
    if (!isCreateModalOpen) return;

    const fetchSantriOptions = async () => {
      try {
        const res = await getAllStudents({ size: 1000 });
        setSantriOptions(
          res.data.map((s: Santri) => ({
            value: s.id,
            label: s.name,
          }))
        );
      } catch (error: any) {
        showToast(error.message, "ERROR");
      }
    };

    fetchSantriOptions();
  }, [isCreateModalOpen, showToast]);

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
    setCurrentPage(1); 
  };

  const handleReset = () => {
    setFilterValues(initialFilters);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const mutationForm = useMutationForm();
  const santriId = mutationForm.watch("santriId");
  const purpose = mutationForm.watch("purpose");

  useEffect(() => {
    if (!santriId || purpose !== "debt_payment") {
      setDebtOptions([]);
      mutationForm.setValue("debtId", null);
      return;
    }

    let isCancelled = false;

    const fetchDebts = async () => {
      try {
        const res = await getSantriDebts(santriId);
        if (isCancelled) return;

        const opts = res.data.map((d: debt) => ({
          value: d.id,
          label: `Sisa Rp ${Number(d.remainingAmount).toLocaleString("id-ID")}`,
        }));

        setDebtOptions(opts);

        const currentDebtId = mutationForm.getValues("debtId");
        if (currentDebtId && !opts.some((o: { value: string; label: string }) => o.value === currentDebtId)) {
          mutationForm.setValue("debtId", null);
        }
      } catch (error) {
        if (!isCancelled) {
          setDebtOptions([]);
          mutationForm.setValue("debtId", null);
        }
      }
    };

    fetchDebts();

    return () => {
      isCancelled = true;
    };
  }, [santriId, purpose, mutationForm]);

  const onSubmit: SubmitHandler<Mutation> = async (data) => {
    setIsLoading(true);

    try {
      const payload: InputMutationParams = {
        date: data.date,
        type: mode, // Use the current mode
        amount: data.amount,
        purpose: data.purpose,
        description: data.description?.trim() === "" ? "-" : data.description,
        vendorId: data.vendorId,
        santriId: data.santriId ?? null,
        categoryId: data.categoryId ?? null,
        debtId: data.debtId ?? null,
      };

      await createMutation(payload);

      setIsCreateModalOpen(false);
      mutationForm.reset();

      const params = buildApiParams(debouncedFilters, currentPage, pageSize);
      await fetchMutations(params);

      showToast(mode === "income" ? "Pemasukan berhasil ditambahkan!" : "Pengeluaran berhasil ditambahkan!", "SUCCESS");
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async (mutation: Mutation) => {
    try {
      setIsLoading(true);
      if (mutation.id === undefined) throw new Error("ID transaksi tidak ditemukan");

      const response = await getTransactionsPdf(mutation.id);
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      downloadPdf(blob, `transaksi-${mutation.date}.pdf`);

      showToast("PDF berhasil diunduh", "SUCCESS");
    } catch (error: any) {
      showToast(error.message || "Gagal mengunduh PDF", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAllPdf = async () => {
    try {
      setIsLoading(true);

      const response = await getAllTransactionsPdf();
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const today = new Date()
      downloadPdf(blob, `transaksi-${formatFilterDate(today)}.pdf`);

      showToast("PDF berhasil diunduh", "SUCCESS");
    } catch (error: any) {
      showToast(error.message || "Gagal mengunduh PDF", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (mutation: Mutation) => {
    setSelectedMutation(mutation);
    setIsDetailModalOpen(true);
  };

  return {
    mutations,
    mutationForm,
    filterValues,
    filterFields,
    mode,
    isLoading,
    isModalOpen,
    isDeleteModalOpen,
    isWarningModalOpen,
    isexpenseModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    currentPage,
    sortConfig,
    pageSize,
    isFiltering,
    totalItems,
    santriOptions,
    categoryOptions,
    vendorOptions,
    debtOptions,
    selectedMutation,

    handleDownloadPdf,
    handleDownloadAllPdf,
    handleRowClick,

    handleFilterChange,
    handleReset,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
    setSelectedMutation,
    setSortConfig,
    setIsLoading,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsWarningModalOpen,
    setIsexpenseModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    setMode,
  };
};
