"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { SortConfig } from "@/components/commons/Table/Table";
import { useToast } from "@/contexts/ToastContext";
import { Santri } from "../model";
import { GetAllsantrisParams } from "@/api/types/types";
import { usesantriForm } from "../_components/SantriSchema";
import { dummySantri } from "@/components/dummy/Santri";

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
  const [santris, setSantris] = useState<Santri[] | null>(dummySantri);
  const [currentSantri, setCurrentSantri] = useState<Santri | null>(dummySantri[1]);
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "createdAt",
    direction: "desc",
  });
  const { showToast } = useToast();

  const filterFields = [
    {
      key: "search",
      label: "search",
      type: "text" as const,
      placeholder: "Cari Nama Santri",
    },
  ];

  const initialFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));
  const [filterValues, setFilterValues] = useState(initialFilters);
  const isFiltering = Object.values(filterValues).some((val) => val !== "" && val !== null && val !== undefined);

  const debouncedFilters = useDebounce(filterValues, 500);

  const buildApiParams = useCallback((filters: Record<string, string | string[]>, page: number, size: number, sort: SortConfig | null): GetAllsantrisParams => {
    const params: GetAllsantrisParams = {
      page,
      size,
    };

    if (filters.search && filters.search !== "") {
      params.search = filters.vendor as string;
    }

    return params;
  }, []);

  // const fetchsantris = useCallback(
  //   async (params?: GetAllsantrisParams) => {
  //     setIsLoading(true);
  //     try {
  //       const apiParams = params || buildApiParams(debouncedFilters, currentPage, pageSize, sortConfig);

  //       const response = await getAllsantris(apiParams);

  //       if (response.data.items === null) {
  //         setsantris(null);
  //         setTotalItems(response.data.totalItems);
  //       } else {
  //         const formattedsantris = response.data.items.map((item, index) => ({
  //           id: item.id,
  //           number: String((apiParams.page - 1) * apiParams.size + index + 1),
  //           createdAt: item.createdAt,
  //           name: item.name,
  //           createdBy: item.createdBy,
  //           publishStatus: item.publishStatus,
  //           originalData: item,
  //         }));

  //         setsantris(formattedsantris);
  //         setTotalItems(response.data.totalItems);
  //       }
  //     } catch (error: unknown) {
  //       showToast(error.message, "ERROR");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [buildApiParams, currentPage, pageSize, sortConfig, showToast, debouncedFilters]
  // );

  // useEffect(() => {
  //   const params = buildApiParams(debouncedFilters, currentPage, pageSize, sortConfig);
  //   fetchsantris(params);
  // }, [debouncedFilters, currentPage, pageSize, sortConfig, fetchsantris, buildApiParams]);

    const handleView = async (santri: Santri) => {
    try {
      // const detailResponse = await getSantriById(santri.id);
      // const detailData = detailResponse.data;

      setCurrentSantri(santri);
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
  };

  const handleReset = () => {
    setFilterValues(initialFilters);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const santriForm = usesantriForm();

  const onSubmit: SubmitHandler<Santri> = async (data) => {
    setIsLoading(true);

    try {
      const payload: Santri = {
        name: data.name,
        class: data.class,
        status: data.status,
        generation: data.generation,
    };

      // await createsantri(payload);

      setIsCreateModalOpen(false);
      showToast( "Santri berhasil ditambahkan!", "SUCCESS");
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
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    setMode,
    setCurrentSantri,
    handleView
  };
};
