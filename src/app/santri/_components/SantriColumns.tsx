import type { Field } from "@/components/commons/Form/Form";
import { SantriFormValue } from "./SantriSchema";

export const santriFields: Field<SantriFormValue>[] = [
  {
    name: "name",
    label: "Nama Santri",
    type: "text",
    required: true,
    placeholder: "Masukkan Nama Santri",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Pilih Status Santri",
    required: true,
  },
  {
    name: "class",
    label: "Kelas",
    type: "text",
    placeholder: "Masukkan Kelas Santri",
    required: true,
  },
  {
    name: "generation",
    label: "Angkatan",
    type: "number",
    placeholder: "Masukkan Tahun Masuk Santri",
    required: true,
  },


];
