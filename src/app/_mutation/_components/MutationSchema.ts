import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const mutationSchema = yup.object({
  date: yup.string().required("wajib diisi").defined(),
  type: yup.mixed<"income" | "outcome">().oneOf(["income", "outcome"]).required("wajib diisi"),
  amount: yup.number().required("wajib diisi"),
  description: yup.string().optional().default(''),
  information: yup.string().required("wajib diisi"),
  category: yup.string().required("wajib diisi"),
});

export type MutationFormValue = yup.InferType<typeof mutationSchema>;

export const useMutationForm = () => {
  return useForm<MutationFormValue>({
    resolver: yupResolver(mutationSchema),
    defaultValues: {
      date: "",
      type: "income",
      category: "",
      amount: undefined,
      description: "",
      information: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
};
