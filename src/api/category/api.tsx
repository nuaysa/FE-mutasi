import apiResolver from "@/api/apiResolver";
import { axios } from "@/api/index";
import { settingsParam } from "../types/types";

export function getCategories() {
  return apiResolver(() => axios.get("category"), {
    throwErrorObject: true,
  });
}

export function editCategory(id: string, data: settingsParam) {
  return apiResolver(() => axios.patch(`category/${id}`, data), {
    throwErrorObject: true,
  });
}

export function deleteCategory(id: string) {
  return apiResolver(() => axios.patch(`category/delete/${id}`), {
    throwErrorObject: true,
  });
}

export function createCategory(data: settingsParam) {
  return apiResolver(() => axios.post(`category`, data), {
    throwErrorObject: true,
  });
}



