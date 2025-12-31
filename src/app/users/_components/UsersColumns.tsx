import type { Field } from "@/components/commons/Form/Form";
import { UserFormValue } from "./UsersSchema";

export const fields: Field<UserFormValue>[] = [
  {
    name: "name",
    label: "Nama user",
    type: "text",
    required: true,
    placeholder: "Masukkan nama user",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    placeholder: "Pilih role user",
    options: [
      {
        value: "admin",
        label: "Admin",
      },
      {
        value: "user",
        label: "User",
      },
    ],
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Masukkan email user",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Masukkan password user",
  },
];
