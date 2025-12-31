import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const santriSchema = yup.object({
  name: yup.string().required("wajib diisi").defined(),
  grade: yup.string().required("wajib diisi").defined(),
  status: yup.string().required("wajib diisi").defined(),
  generation: yup.number().required("wajib diisi"),
});

export type SantriFormValue = yup.InferType<typeof santriSchema>;

export const usesantriForm = () => {
  return useForm<SantriFormValue>({
    resolver: yupResolver(santriSchema),
    defaultValues: {
      name: "",
      grade: "",
      status: "",
      generation: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
};
