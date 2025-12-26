import { createURLParams } from "@/utils/helpers";
import { axios } from "..";
import apiResolver from "../apiResolver";
import type { GetAllEventsParams, InputEventParams } from "../types/types";

export function getAllEvents(params: GetAllEventsParams) {
  const { size, search, page, createdAt, publishStatus, ...others } = params;

  const queryParams = createURLParams({
    size,
    search,
    page,
    createdAt,
    publishStatus,
    ...others,
  });

  return apiResolver(() => axios.get(`v1/dashboard/events${queryParams}`), {
    throwErrorObject: true,
  });
}

export function getEventById(id: string) {
  return apiResolver(() => axios.get(`v1/dashboard/events/${id}`), {
    throwErrorObject: true,
  });
}

export function updateEventToggle(id: string) {
  return apiResolver(
    () => axios.put(`v1/dashboard/events/${id}/toggle/publish`),
    {
      throwErrorObject: true,
    }
  );
}

export function deleteEvent(id: string) {
  return apiResolver(() => axios.delete(`v1/dashboard/events/${id}`), {
    throwErrorObject: true,
  });
}

export function createEvent(data: InputEventParams) {
  return apiResolver(() => axios.post(`v1/dashboard/events`, data), {
    throwErrorObject: true,
  });
}

export function editEvent({
  id,
  data,
}: {
  id: string;
  data: InputEventParams;
}) {
  return apiResolver(() => axios.put(`v1/dashboard/events/${id}`, data), {
    throwErrorObject: true,
  });
}
