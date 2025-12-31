import apiResolver from "@/api/apiResolver";
import { axios } from "@/api/index";
import { settingsParam } from "../types/types";

export function getVendors() {
  return apiResolver(() => axios.get("vendor"), {
    throwErrorObject: true,
  });
}

export function editVendor(id: string, data: settingsParam) {
  return apiResolver(() => axios.patch(`vendor/${id}`, data), {
    throwErrorObject: true,
  });
}

export function deleteVendor(id: string) {
  return apiResolver(() => axios.patch(`vendor/delete/${id}`), {
    throwErrorObject: true,
  });
}

export function createVendor(data: settingsParam) {
  return apiResolver(() => axios.post(`vendor`, data), {
    throwErrorObject: true,
  });
}



