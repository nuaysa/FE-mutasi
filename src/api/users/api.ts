import { axios } from "..";
import apiResolver from "../apiResolver";
import { InputUserParams } from "../types/types";

export function getAllUsers() {
  return apiResolver(() => axios.get(`user/`), {
    throwErrorObject: true,
  });
}

export function getUserById(id: string) {
  return apiResolver(() => axios.get(`user/${id}`), {
    throwErrorObject: true,
  });
}

export function createUser(data: InputUserParams) {
  return apiResolver(() => axios.post(`auth/register/`, data), {
    throwErrorObject: true,
  });
}

export function editUser({ id, data }: { id: string; data: InputUserParams }) {
  return apiResolver(() => axios.patch(`user/edit/${id}`, data), {
    throwErrorObject: true,
  });
}

export function deleteUser(id: string) {
  return apiResolver(() => axios.patch(`user/delete/${id}`), {
    throwErrorObject: true,
  });
}
