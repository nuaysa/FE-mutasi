import { InputMutationParams } from "@/api/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export type MutationFormValue = Omit<InputMutationParams, "id" | "createdAt" | "updatedAt"> & {
  date: string;
  santriId?: string | null;
  debtId?: string | null;
  vendorId?: string | null;
};

export const mutationSchema = yup.object().shape({
  date: yup.string().required("Tanggal wajib diisi"),

  type: yup.mixed<"income" | "expense">().oneOf(["income", "expense"]).required(),

  purpose: yup.mixed<"deposit_topup" | "deposit_withdrawal" | "debt_created" | "debt_payment" | "other">().oneOf(["deposit_withdrawal", "deposit_topup", "debt_created", "debt_payment", "other"]).required(),

  amount: yup.number().typeError("Nominal wajib diisi").positive("Nominal harus lebih dari 0").required("Nominal wajib diisi"),

  description: yup.string().nullable().optional(),

  categoryId: yup.string().required("Kategori wajib diisi"),

  santriId: yup.string().nullable().optional(),
  debtId: yup
    .string()
    .nullable()
    .optional()
    .when("purpose", {
      is: "debt_payment",
      then: (schema) => schema.required("Hutang wajib dipilih") as yup.StringSchema,
    }),

  vendorId: yup
    .string()
    .nullable()
    .optional()
    .when("santriId", {
      is: (v: any) => !v,
      then: (schema) => schema.required("Vendor wajib dipilih") as yup.StringSchema,
    }),
}) as yup.ObjectSchema<MutationFormValue>;

export const useMutationForm = () => {
  return useForm<MutationFormValue>({
    resolver: yupResolver(mutationSchema),
    defaultValues: {
      date: "",
      type: "income",
      purpose: "other",
      categoryId: "",
      amount: 0, // Ubah undefined jadi 0
      description: "-",
      santriId: null,
      debtId: null,
      vendorId: null,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
};
