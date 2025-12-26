import apiResolver from "@/api/apiResolver";
import { axios, axiosNoAuth } from "@/api/index";
import type { LoginParams, LogoutParam } from "../types/types";

export function login(param: LoginParams) {
  return apiResolver(() => axiosNoAuth.post("/login", param), {
    throwErrorObject: true,
  });
}

export function logoutAPI(data: LogoutParam) {
  return apiResolver(() => axios.post("/logout", data), {
    throwErrorObject: true,
  });
}

export function getProfile() {
  return apiResolver(() => axios.get("/profile"), {
    throwErrorObject: true,
  });
}
