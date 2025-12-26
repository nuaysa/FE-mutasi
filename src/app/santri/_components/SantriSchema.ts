import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const santriSchema = yup.object({
  name: yup.string().required("wajib diisi").defined(),
  class: yup.string().required("wajib diisi").defined(),
  generation: yup.number().required("wajib diisi"),
});

export type SantriFormValue = yup.InferType<typeof santriSchema>;

export const usesantriForm = () => {
  return useForm<SantriFormValue>({
    resolver: yupResolver(santriSchema),
    defaultValues: {
      name: "",
      class: "",
      generation: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
};
