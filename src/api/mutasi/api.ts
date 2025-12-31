import { createURLParams } from "@/utils/helpers";
import { axios } from "..";
import apiResolver from "../apiResolver";
import { GetAllmutationsParams, InputMutationParams } from "../types/types";

export function getAllMutations(params: GetAllmutationsParams) {
  const { size, page, vendorId, date, type, categoryId, ...others } = params;

  const queryParams = createURLParams({
    size,

    page,
    vendorId,
    date,
    type,
    categoryId,
    ...others,
  });

  return apiResolver(() => axios.get(`transaction/${queryParams}`), {
    throwErrorObject: true,
  });
}

export function getMutationById(id: string) {
  return apiResolver(() => axios.get(`transaction/${id}`), {
    throwErrorObject: true,
  });
}

export function getSantriDebts(id: string) {
  return apiResolver(() => axios.get(`transaction/debts/${id}/?status=open`), {
    throwErrorObject: true,
  });
}

export function createMutation(data: InputMutationParams) {
  return apiResolver(() => axios.post(`transaction/`, data), {
    throwErrorObject: true,
  });
}

export function editMutation({ id, data }: { id: string; data: InputMutationParams }) {
  return apiResolver(() => axios.patch(`transaction/${id}`, data), {
    throwErrorObject: true,
  });
}
