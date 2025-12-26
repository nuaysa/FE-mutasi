"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
// import { createEvent, editEvent, getAllmutations } from "@/api/mutations";
// import type { GetAllmutationsParams } from "@/api/types/types";
import type { SortConfig } from "@/components/commons/Table/Table";
import { useToast } from "@/contexts/ToastContext";
import { Mutation } from "../model";
import { useMutationForm } from "../_components/MutationSchema";
import { GetAllmutationsParams } from "@/api/types/types";
import { dummyCategories, dummyVendors } from "@/components/dummy/Settings";
import { mapToOptionsByKey } from "@/utils/helpers";

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
  const [mutations, setmutations] = useState<Mutation[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isOutcomeModalOpen, setisOutcomeModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"income" | "outcome">("income");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "createdAt",
    direction: "desc",
  });
  const { showToast } = useToast();

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
        { value: "outcome", label: "Pengeluaran" },
      ],
      placeholder: "Jenis Transaksi",
    },
    {
      key: "category",
      label: "Kategori",
      type: "select" as const,
      placeholder: "Kategori",
         options: mapToOptionsByKey(dummyCategories, "name"),
    },
    {
      key: "information",
      label: "Vendor/Pihak Ke-3",
      type: "select" as const,
      placeholder: "Vendor/Pihak Ke-3",
      options: mapToOptionsByKey(dummyVendors, "name"),
    },
  ];

  const initialFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));
  const [filterValues, setFilterValues] = useState(initialFilters);
  const isFiltering = Object.values(filterValues).some((val) => val !== "" && val !== null && val !== undefined);

  const debouncedFilters = useDebounce(filterValues, 500);

  const buildApiParams = useCallback((filters: Record<string, string | string[]>, page: number, size: number, sort: SortConfig | null): GetAllmutationsParams => {
    const params: GetAllmutationsParams = {
      page,
      size,
    };

    if (filters.information && filters.information !== "") {
      params.information = filters.information as string;
    }

    if (filters.type && filters.type !== "") {
      params.type = filters.type as string;
    }

    if (filters.category && filters.category !== "") {
      params.category = filters.category as string;
    }

    if (filters.date && filters.date !== "") {
      params.date = filters.date.slice(0, 10) as string;
    }

    return params;
  }, []);

  const fetchmutations = useCallback(
    async (params?: GetAllmutationsParams) => {
      setIsLoading(true);
      try {
        const apiParams = params || buildApiParams(debouncedFilters, currentPage, pageSize, sortConfig);

        // const response = await getAllmutations(apiParams);

        // setmutations(response.data.items);
        // setTotalItems(response.data.totalItems);
      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [buildApiParams, currentPage, pageSize, sortConfig, showToast, debouncedFilters]
  );

  useEffect(() => {
    const params = buildApiParams(debouncedFilters, currentPage, pageSize, sortConfig);
    fetchmutations(params);
  }, [debouncedFilters, currentPage, pageSize, sortConfig, fetchmutations, buildApiParams]);

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
  };

  const handleReset = () => {
    setFilterValues(initialFilters);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const mutationForm = useMutationForm();

  const onSubmit: SubmitHandler<Mutation> = async (data) => {
    setIsLoading(true);

    try {
      const payload: Mutation = {
        date: data.date ?? new Date().toISOString(),
        type: data.type,
        amount: data.amount,
        information: data.information,
        description: data.description,
        category: data.category,
      };

      if (mode === "income") {
        payload.type = "income";
      } else if (mode == "outcome") {
        payload.type = "outcome";
      }

      // await createMutation(payload);

      setIsCreateModalOpen(false);
      showToast(data.type === "income" ? "Pemasukan berhasil ditambahkan!" : "Pengeluaran berhasil ditambahkan!", "SUCCESS");
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setIsLoading(true);

      // const params = buildFilterParams(filtersValue);

      // const res = await api.get("/mutasi", {
      //   params: {
      //     ...params,
      //     export: true,
      //   },
      // });

      // downloadCSVFromRawData(res.data, "mutasi");
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setIsLoading(false);
    }
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
    isOutcomeModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    currentPage,
    sortConfig,
    pageSize,
    isFiltering,
    totalItems,

    handleDownloadAll,
    handleFilterChange,
    handleReset,
    onSubmit,
    handlePageChange,
    handlePageSizeChange,
    setIsLoading,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsWarningModalOpen,
    setisOutcomeModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    setMode,
  };
};
