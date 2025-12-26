import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie } from "cookies-next";
import CryptoJS from "crypto-js";
import { PATHS } from "@/utils/constant";

import type { APIResponse, ErrorResponseData } from "./types/axios";

type ConfigOptions = {
  isAuth?: boolean;
  ignoreHeader?: boolean;
  includeXSource?: boolean;
  includeSource?: boolean;
  includeDeviceId?: boolean;
  includePlatform?: boolean;
  includeSmsSource?: boolean;
  customXSource?: string;
  includeCustToken?: boolean;
  isFormData?: boolean;
  includeOTPClient?: boolean;
};

type AxiosConfigParams = {
  baseURL: string;
  config?: ConfigOptions;
};

export const createErrorResponse = (err: AxiosError<ErrorResponseData>) => {
  const message =
    err?.response?.data?.message || err?.message || "Error Exception API";

  return {
    data: err?.response?.data,
    message,
    status: err?.response?.data?.status || err?.response?.status || 500,
  };
};

async function requestHandler(
  request: AxiosRequestConfig,
  config?: ConfigOptions
) {
  if (!request.headers) request.headers = {};

  if (config?.ignoreHeader) return request;

  if (!config?.isFormData) {
    request.headers["Content-Type"] = "application/json";
  }
  if (config?.isAuth) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) request.headers["Authorization"] = `Bearer ${token}`;
  }

  return request;
}

const responseHandler = (response: AxiosResponse<APIResponse<null>>) => {
  const errorMessage = response.data?.message || "Error Exception API";
  const contentType = response.headers["content-type"];
  if (
    contentType?.includes("image") ||
    response.request?.responseType === "blob"
  ) {
    return response;
  }

  if (
    (Object.keys(response.data).includes("status") &&
      !`${response.data.status}`.startsWith("2")) ||
    !`${response.status}`.startsWith("2")
  ) {
    throw {
      error: errorMessage,
      response,
    };
  }

  if (!Object.keys(response.data).includes("status")) {
    return { ...response, data: { ...response.data, status: response.status } };
  }

  return response;
};

const errorHandler = (error: AxiosError<ErrorResponseData>) => {
  if (!error.response) {
    return Promise.reject({
      message:
        "Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi.",
      status: 0,
    });
  }

  const { status, data } = error.response;

  if (status === 401 || status === 403) {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("deviceId");
    deleteCookie("token");

    if (typeof window !== "undefined" && currentPath !== PATHS.login) {
      window.location.href = PATHS.login;
    }

    if (status === 401) {
      return Promise.reject({
        message: "Sesi Anda telah berakhir. Silakan login kembali.",
        status,
      });
    }

    if (status === 403) {
      return Promise.reject({
        message: "Anda tidak memiliki akses untuk melakukan aksi ini.",
        status,
      });
    }
  }

  if (status === 404) {
    return Promise.reject({
      message: "Data tidak ditemukan.",
      status,
    });
  }

  if (status === 400) {
    const originalMessage = data?.message?.toLowerCase() || "";
    let message = originalMessage;

    if (Array.isArray(data?.data) && data.data.length > 0) {
      const first = data.data[0];
      const rawError = first?.Error?.toLowerCase() || "";

      if (rawError.includes("notblank") || rawError.includes("required")) {
        message = "Data tidak lengkap.";
      } else {
        message = `Field ${first.Field} tidak valid.`;
      }

      return Promise.reject({ message, status, data });
    }

    if (!originalMessage) {
      message = "Terjadi kesalahan. Silakan coba lagi.";
    } else {
      if (
        originalMessage.includes("date") &&
        originalMessage.includes("before")
      ) {
        message = "Periode tanggal tidak valid.";
      } else if (
        originalMessage.includes("email") ||
        originalMessage.includes("password")
      ) {
        message = "Email atau Password salah";
      } else if (originalMessage.includes("periode already exists")) {
        message = "Data dengan periode ini sudah terdaftar.";
      } else if (originalMessage.includes("name already exists")) {
        message = "Data dengan title ini sudah terdaftar.";
      } else if (originalMessage.includes("invalid")) {
        message = "Data tidak valid.";
      } else {
        message = "Terjadi kesalahan. Silakan coba lagi.";
      }
    }

    return Promise.reject({ message, status, data });
  }

  if (status >= 500) {
    return Promise.reject({
      message: "Server sedang bermasalah. Silakan coba beberapa saat lagi.",
      status,
    });
  }

  return Promise.reject({
    message: data?.message || "Terjadi kesalahan. Silakan coba lagi.",
    status,
  });
};

const getCustomAxios = ({ baseURL, config }: AxiosConfigParams) => {
  const customAxios = axios.create({
    baseURL,
  });

  customAxios.interceptors.response.use(responseHandler, errorHandler);

  customAxios.interceptors.request.use((request) => {
    const updatedRequest = requestHandler(request, config);
    return updatedRequest as unknown as InternalAxiosRequestConfig;
  }, errorHandler);

  return customAxios;
};

export default getCustomAxios;
