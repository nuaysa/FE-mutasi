import apiResolver from "@/api/apiResolver";
import { axios } from "@/api/index";

export function getSantriPdf(id: string) {
  return apiResolver(() => axios.get(`pdf/santri/${id}`,  {
      responseType: "blob",
      headers: {
        'Accept': 'application/pdf',
      },
    }), {
    throwErrorObject: true,
  });
}
export function getTransactionsPdf(id: string) {
  return apiResolver(() => axios.get(`pdf/transactions/${id}`,  {
      responseType: "blob",
      headers: {
        'Accept': 'application/pdf',
      },
    }), {
    throwErrorObject: true,
  });
}
export function getAllTransactionsPdf() {
  return apiResolver(() => axios.get(`pdf/transactions/`,  {
      responseType: "blob",
      headers: {
        'Accept': 'application/pdf',
      },
    }), {
    throwErrorObject: true,
  });
}
