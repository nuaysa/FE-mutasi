import { createURLParams } from "@/utils/helpers";
import { axios } from "..";
import apiResolver from "../apiResolver";
import { GetAllsantrisParams, InputSantriParams } from "../types/types";

export function getAllStudents(params: GetAllsantrisParams) {
  const { size, page, search, status, generation, ...others } = params;

  const queryParams = createURLParams({
    size,
    page,
    search,
    status,
    generation,
    ...others,
  });

  return apiResolver(() => axios.get(`student/${queryParams}`), {
    throwErrorObject: true,
  });
}

export function getStudentById(id: string) {
  return apiResolver(() => axios.get(`student/${id}`), {
    throwErrorObject: true,
  });
}

export function createStudent(data: InputSantriParams) {
  return apiResolver(() => axios.post(`student/`, data), {
    throwErrorObject: true,
  });
}

export function editStudent({ id, data }: { id: string; data: InputSantriParams }) {
  return apiResolver(() => axios.patch(`student/edit/${id}`, data), {
    throwErrorObject: true,
  });
}
