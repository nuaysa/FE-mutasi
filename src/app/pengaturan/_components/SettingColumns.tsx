import type { Field } from "@/components/commons/Form/Form";
import { SettingFormValue } from "./SettingsSchema";

export const CategoryFields: Field<SettingFormValue>[] = [
  {
    name: "name",
    label: "Nama Kategori",
    type: "text",
    required: true,
    placeholder: "Masukkan Nama Kategori",
  },
];

export const VendorFields: Field<SettingFormValue>[] = [
  {
    name: "name",
    label: "Nama Vendor",
    type: "text",
    required: true,
    placeholder: "Masukkan Nama Vendor",
  },
];
