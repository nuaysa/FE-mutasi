import apiResolver from "@/api/apiResolver";
import { axios, axiosNoAuth } from "@/api/index";
import type { LoginParams} from "../types/types";

export function login(param: LoginParams) {
  return apiResolver(() => axiosNoAuth.post("auth/login", param), {
    throwErrorObject: true,
  });
}

export function logoutAPI() {
  return apiResolver(() => axios.post("auth/logout"), {
    throwErrorObject: true,
  });
}

export function getProfile() {
  return apiResolver(() => axios.get(`auth/profile`), {
    throwErrorObject: true,
  });
}
