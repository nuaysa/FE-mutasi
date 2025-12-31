import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";


export const userSchema = yup.object({
  name: yup.string().required("* Nama wajib diisi"),
  role: yup.string().required("* Role wajib diisi"),
  email: yup.string().required("* Email wajib diisi"),
  password: yup.string().required("* Password wajib diisi"),
});

export type UserFormValue = yup.InferType<typeof userSchema>;

export const useUserForm = () => {
  return useForm<UserFormValue>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
  });
};

